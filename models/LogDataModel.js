const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  databaseName: String,
  collectionName: String,
  operation: String,
  AuthenticatedUser: String,
  details: mongoose.Schema.Types.Mixed,
  timestamp: Date
}, { strict: false });

const AuditLog = mongoose.model("AuditLog", logSchema);

module.exports = AuditLog;