const AuditLog = require('../models/LogDataModel');

const AuditLogController = (() => {
  let lastProcessedTimestamp = new Date(Date.now() - 15 * 60 * 1000);

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
      throw error;
    }
  };

  const formatLog = (log) => {
    try {
      const [databaseName, collectionName] = log.param && log.param.ns ? log.param.ns.split('.') : ['Unknown', 'Unknown'];
      const operation = log.param ? log.param.command : 'Unknown';
      const AuthenticatedUser = log.users && log.users.length > 0 ? log.users[0].user : 'Unknown';
      const timestamp = log.ts && log.ts.$date ? new Date(log.ts.$date) : new Date();
      const details = formatDetails(operation, log.param ? log.param.args : undefined);

      return { databaseName, collectionName, operation, AuthenticatedUser, details, timestamp };
    } catch (error) {
      console.error('Error formatting log:', error);
      throw error;
    }
  };

  const formatDetails = (operation, args) => {
    try {
      if (!args) return { operationDetails: 'No details available' };

      switch (operation) {
        case 'insert':
          if (!args.documents) return { documents: [] };
          return {
            documents: args.documents.map(doc => ({
              ...doc,
              _id: doc._id && doc._id.$oid ? doc._id.$oid : doc._id
            }))
          };
        case 'update':
          if (!args.updates || !args.updates[0]) return { query: {}, update: {}, multi: false };
          return {
            query: args.updates[0].q || {},
            update: args.updates[0].u || {},
            multi: args.updates[0].multi || false
          };
        case 'delete':
          if (!args.deletes || !args.deletes[0]) return { query: {}, limit: 0 };
          return {
            query: args.deletes[0].q || {},
            limit: args.deletes[0].limit || 0
          };
        default:
          return { operationDetails: args };
      }
    } catch (error) {
      console.error('Error formatting details:', error);
      throw error;
    }
  };

  return {
    processAndSaveNewLogs,
    saveLogs
  };
})();

module.exports = AuditLogController;
