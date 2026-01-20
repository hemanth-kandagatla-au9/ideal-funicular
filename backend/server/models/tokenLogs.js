const mongoose = require("mongoose");

const tokenLogSchema = new mongoose.Schema({
  username: {
    type:String
  },
  token:{
    type:String
  },
  action: {
    type:String
  }, // GENERATED | SUCCESS | FAILED
  wrongTokenCount: {
    type:Number,
    default:0
  },
  expiresTime:{
    type:Date
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TokenLogs", tokenLogSchema);