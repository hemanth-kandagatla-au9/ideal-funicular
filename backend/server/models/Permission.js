const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  project: {
    type: String,
    required: [true, 'Project is required'],
    trim: true,
    maxlength: [50, 'Project name cannot exceed 50 characters']
  },
  module: {
    type: String,
    required: [true, 'Module is required'],
    trim: true,
    maxlength: [50, 'Module name cannot exceed 50 characters']
  },
  permission: {
    type: String,
    required: [true, 'Permission is required'],
    trim: true,
    maxlength: [50, 'Permission name cannot exceed 50 characters']
  },
  code: {
    type: String,
    required: false, // Auto-generated in pre-save hook
    unique: true,
    trim: true,
    maxlength: [200, 'Permission code cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: false,
    default: 'system'
  },
  updatedBy: {
    type: String,
    required: false,
    default: 'system'
  }
}, {
  timestamps: true
});

// Indexes
permissionSchema.index({ code: 1 }, { unique: true });
permissionSchema.index({ project: 1, module: 1, permission: 1 });
permissionSchema.index({ project: 1 });
permissionSchema.index({ module: 1 });
permissionSchema.index({ isActive: 1 });


// Pre-save middleware to generate permission code
permissionSchema.pre('save', function(next) {
  // Always generate code from project, module, and permission
  if (!this.code || this.isModified('project') || this.isModified('module') || this.isModified('permission')) {
    this.code = `${this.project}:${this.module}:${this.permission}`;
  }
  next();
});

// Static method to validate permission codes exist
permissionSchema.statics.validateCodes = async function(codes) {
  const existingPermissions = await this.find({ 
    code: { $in: codes }, 
    isActive: true 
  }).select('code');
  
  const existingCodes = existingPermissions.map(p => p.code);
  const invalidCodes = codes.filter(code => !existingCodes.includes(code));
  
  return {
    valid: invalidCodes.length === 0,
    invalidCodes,
    existingCodes
  };
};

// Static method to get grouped permissions for assignment matrix
permissionSchema.statics.getGroupedPermissions = async function(userRoles = []) {
  const permissions = await this.find({ isActive: true })
    .sort({ project: 1, module: 1, permission: 1 });
  
  const userRolesSet = new Set(userRoles);
  const grouped = {};
  
  permissions.forEach(perm => {
    if (!grouped[perm.project]) {
      grouped[perm.project] = {};
    }
    if (!grouped[perm.project][perm.module]) {
      grouped[perm.project][perm.module] = [];
    }
    
    grouped[perm.project][perm.module].push({
      code: perm.code,
      permission: perm.permission,
      description: perm.description,
      granted: userRolesSet.has(perm.code)
    });
  });
  
  // Convert to array format for API response
  const projects = Object.keys(grouped).map(projectName => ({
    project: projectName,
    modules: Object.keys(grouped[projectName]).map(moduleName => ({
      module: moduleName,
      permissions: grouped[projectName][moduleName]
    }))
  }));
  
  return projects;
};

// Static method for paginated search
permissionSchema.statics.searchWithPagination = async function(filters = {}, page = 1, limit = 20) {
  const query = { isActive: true };
  
  if (filters.project) {
    query.project = new RegExp(filters.project, 'i');
  }
  if (filters.module) {
    query.module = new RegExp(filters.module, 'i');
  }
  if (filters.permission) {
    query.permission = new RegExp(filters.permission, 'i');
  }
  if (filters.search) {
    query.$or = [
      { project: new RegExp(filters.search, 'i') },
      { module: new RegExp(filters.search, 'i') },
      { permission: new RegExp(filters.search, 'i') },
      { description: new RegExp(filters.search, 'i') }
    ];
  }
  
  const skip = (page - 1) * limit;
  
  return Promise.all([
    this.find(query)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    this.countDocuments(query)
  ]).then(([permissions, total]) => ({
    permissions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }));
};

module.exports = mongoose.model('Permission', permissionSchema);