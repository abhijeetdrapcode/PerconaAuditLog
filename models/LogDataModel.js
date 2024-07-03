const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  atype: { type: String, required: true },
  timestamp: { type: Date, required: true },
  local: {
    ip: { type: String, required: true },
    port: { type: Number, required: true }
  },
  remote: {
    ip: { type: String, required: true },
    port: { type: Number, required: true }
  },
  users: [{ type: mongoose.Schema.Types.Mixed, required: true }],
  roles: [{ type: mongoose.Schema.Types.Mixed, required: true }],
  param: {
    ns: { type: String, required: true }
  },
  result: { type: Number, required: true }
});

const AuditLog = mongoose.model('AuditLog', logSchema);

module.exports = AuditLog;
