const AuditLog = require('../models/LogDataModel');

const AuditLogController = (() => {
  let lastProcessedTimestamp = new Date(Date.now() - 5 * 60 * 1000); 

  const processAndSaveNewLogs = async (jsonObjects) => {
    try {
      const currentTime = new Date();
      const newLogs = jsonObjects.filter(log => {
        const logTimestamp = new Date(log.ts.$date);
        return logTimestamp > lastProcessedTimestamp && logTimestamp <= currentTime;
      });

      if (newLogs.length > 0) {
        await saveLogs(newLogs);
        lastProcessedTimestamp = currentTime;
        console.log(`Processed and saved ${newLogs.length} new log entries.`);
      } else {
        console.log('No new logs to process.');
      }
    } catch (error) {
      console.error('Error processing logs:', error);
    }
  };

  const saveLogs = async (logs) => {

    console.log('Attempting to save logs:', JSON.stringify(logs, null, 2));
    try {
      const formattedLogs = logs.map(log => ({
        atype: log.atype,
        timestamp: new Date(log.ts.$date),
        local: log.local,
        remote: log.remote,
        users: log.users,
        roles: log.roles,
        param: log.param,
        result: log.result
      }));

      await AuditLog.insertMany(formattedLogs);
      console.log('Logs saved successfully');
    } catch (error) {
      console.error('Error saving logs to database:', error);
    }
  };

  return {
    processAndSaveNewLogs,
    saveLogs
  };
})();

module.exports = AuditLogController;
