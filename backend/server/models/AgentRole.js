const mongoose = require('mongoose');

/**
 * Simple Agent Role Schema
 * Stores username and their associated roles for JWT token generation
 */
const agentRoleSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      collation: { locale: "en", strength: 2 } 
    },
    roles: [{
      type: String,
      trim: true
      // e.g., ['agent:status:read', 'agent:command:execute', 'agent:job:create']
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

agentRoleSchema.index({ isDeleted: 1, isActive: 1 });

module.exports = mongoose.model('AgentRole', agentRoleSchema);