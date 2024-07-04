const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  collectionName: String,
  operation: String,
  username: String,
  parameter: {
    command: String,
    ns: String
  },
  argument: mongoose.Schema.Types.Mixed,
  timestamp: Date
});

const AuditLog = mongoose.model("AuditLog", logSchema);

module.exports = AuditLog;