const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  atype: String,
  ts: Date,
  local: {
    ip: String,
    port: Number
  },
  remote: {
    ip: String,
    port: Number
  },
  users: [{
    user: String,
    db: String
  }],
  roles: [{
    role: String,
    db: String
  }],
  param: {
    command: String,
    ns: String,
    args: {
      insert: String,
      documents: [{
        name: String,
        age: Number,
        _id: {
          $oid: String
        }
      }],
      ordered: Boolean,
      lsid: {
        id: {
          $binary: String,
          $type: String
        }
      },
      $db: String
    }
  },
  result: Number
});

const AuditLog = mongoose.model("AuditLog", logSchema);

module.exports = AuditLog;