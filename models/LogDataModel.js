const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  atype: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
  local: {
    ip: {
      type: String,
    },
    port: {
      type: Number,
    },
  },
  remote: {
    ip: {
      type: String,
    },
    port: {
      type: Number,
    },
  },
  users: [{ type: mongoose.Schema.Types.Mixed }],
  roles: [{ type: mongoose.Schema.Types.Mixed }],
  database_collectionName: {
    ns: { type: String },
  },
  result: { type: Number },
});

const AuditLog = mongoose.model("AuditLog", logSchema);

module.exports = AuditLog;
