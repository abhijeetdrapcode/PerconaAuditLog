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
    try {
      console.log(logs);
      const formattedLogs = logs.map(formatLog);
      console.log(formattedLogs);
      await AuditLog.insertMany(formattedLogs);
      console.log('Logs saved successfully');
    } catch (error) {
      console.error('Error saving logs to database:', error);
    }
  };

  const formatLog = (log) => {
    const [databaseName, collectionName] = log.param.ns.split('.');
    const operation = log.param.command;
    const username = log.users.length > 0 ? log.users[0].user : 'Unknown';
    const timestamp = new Date(log.ts.$date);
    const details = formatDetails(operation, log.param.args);

    return { databaseName, collectionName, operation, username, timestamp, ...details };
  };

  const formatDetails = (operation, args) => {
    switch (operation) {
      case 'insert':
        return {
          insertedDocuments: args.documents.map(doc => {
            const { _id, ...rest } = doc;
            return { ...rest, _id: _id.$oid };
          })
        };
      case 'update':
        return {
          updateQuery: args.updates[0].q,
          updateOperations: args.updates[0].u,
          multi: args.updates[0].multi
        };
      case 'delete':
        return {
          deleteQuery: args.deletes[0].q,
          deleteLimit: args.deletes[0].limit
        };
      default:
        return { operationDetails: args };
    }
  };

  return {
    processAndSaveNewLogs,
    saveLogs
  };
})();

module.exports = AuditLogController;