const mongoose = require('mongoose');

/**
 * Agent User Details Collection Schema
 * Primary user accounts for the User Authorization system
 */
const agentUserDetailsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: false,
    default: true
  },
  
  // DENORMALIZED roles array for fast auth & UI pre-population
  roles: [{
    type: String,
    trim: true
    // Format: "agent:status:read", "agent:metric:update", etc.
  }],
  
  createdBy: {
    type: String,
    required: false,
    default: 'Admin'
  },
  updatedBy: {
    type: String,
    required: false,
    default: 'Admin'
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for roles count
agentUserDetailsSchema.virtual('rolesCount').get(function() {
  return this.roles ? this.roles.length : 0;
});

// Indexes for performance
agentUserDetailsSchema.index({ username: 1 }, { unique: true });
agentUserDetailsSchema.index({ isActive: 1 });
agentUserDetailsSchema.index({ createdAt: -1 });

// Pre-save middleware to ensure roles array is clean
agentUserDetailsSchema.pre('save', function(next) {
  if (this.roles) {
    // Remove duplicates and empty strings
    this.roles = [...new Set(this.roles.filter(role => role && role.trim()))];
  }
  next();
});

module.exports = mongoose.model('agent-user-roles', agentUserDetailsSchema);