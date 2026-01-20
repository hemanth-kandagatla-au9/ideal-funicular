const responseCodes = require('../../utils/responseCodes');
const agentUserDetails =  require('../../models/agentUserDetails');
const Permission = require('../../models/Permission');
// const messages = require('../../utils/messages');
const bcrypt =  require('bcrypt')


/**
 * Get all users with pagination and search
 * GET /api/auth/users
 */
const getUserDetails = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      isActive
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.username = { $regex: search, $options: 'i' };
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Convert to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [users, total] = await Promise.all([
      agentUserDetails.find(query)
        .populate('createdBy', 'username')
        .populate('updatedBy', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      agentUserDetails.countDocuments(query)
    ]);

    // Format response
    const formattedUsers = users.map(user => ({
      id: user._id,
      username: user.username,
      isActive: user.isActive,
      rolesCount: user.roles?.length || 0,
      roles: user.roles,
      createdBy: user.createdBy?.username || 'Admin',
      updatedBy: user.updatedBy?.username || 'Admin',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    const pagination = {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    };

    res.status(responseCodes.SUCCESS).json({
      flag: 'success',
      data: {
        users: formattedUsers,
        pagination
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(responseCodes.SERVER_ERROR).json({
      flag: 'error',
      error: 'Failed to fetch users'
    });
  }
};

/**
 * Get all permissions with pagination and filters
 * GET /api/auth/permissions
 */
const getPermissions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      project,
      module,
      permission,
      search
    } = req.query;

    // Build filters
    const filters = {};
    if (project) filters.project = project;
    if (module) filters.module = module;
    if (permission) filters.permission = permission;
    if (search) filters.search = search;

    // Get paginated results
    const result = await Permission.searchWithPagination(
      filters,
      parseInt(page),
      parseInt(limit)
    );

    // Format response
    const formattedPermissions = result.permissions.map(perm => ({
      id: perm._id,
      project: perm.project,
      module: perm.module,
      permission: perm.permission,
      code: perm.code,
      description: perm.description,
      createdBy: perm.createdBy?.username || 'Admin',
      createdAt: perm.createdAt
    }));

    res.status(responseCodes.SUCCESS).json({
      flag: 'success',
      data: {
        permissions: formattedPermissions,
        pagination: result.pagination
      }
    });

  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(responseCodes.SERVER_ERROR).json({
      flag: 'error',
      error: 'Failed to fetch permissions'
    });
  }
};


/**
 * Create a new user (Add User Modal)
 * POST method
 */
const addUser = async (req, res) => {
  try {
    const { username, password, cloneFromUserId } = req.body;
    // const currentUserId = req.user; // From JWT middleware

    // Validation
    if (!username || !password) {
      return res.status(responseCodes.ERROR).json({
        flag: 'error',
        error: 'Username and password are required'
      });
    }

    // Username format validation
    const usernameRegex = /^[a-zA-Z0-9\-_]{3,50}$/;
    if (!usernameRegex.test(username)) {
      return res.status(responseCodes.ERROR).json({
        flag: 'error',
        error: 'Username must be 3-50 characters and contain only letters, numbers, hyphens, and underscores'
      });
    }

    // // Password strength validation
    const passwordRegex = /^[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(responseCodes.ERROR).json({
        flag: 'error',
        error: 'Password must be at least 8 charactersand may contain special character'
      });
    }

    //  clone user permissions
   let permissionData
   if(cloneFromUserId){
    const permissionDataResult = await agentUserDetails.findOne({ username:cloneFromUserId });
    console.log('permissionDataResult',permissionDataResult)
    permissionData = permissionDataResult.roles
  }

    // Check if username already exists
    const existingUser = await agentUserDetails.findOne({ username });
    if (existingUser) {
      return res.status(responseCodes.EXISTS).json({
        flag: 'error',
        error: 'Username already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = new agentUserDetails({
      username,
      password:passwordHash,
      roles: permissionData || [], // Start with empty roles array
      createdBy: 'Admin',
      updatedBy: 'Admin'
    });

    await newUser.save();


    // Response (exclude sensitive data)
    // const response = {
    //   id: savedUser._id,
    //   username: savedUser.username,
    //   isActive: savedUser.isActive,
    //   rolesCount: savedUser.rolesCount,
    //   createdBy: savedUser.createdBy?.username || 'Admin',
    //   createdAt: savedUser.createdAt
    // };

    res.status(responseCodes.CREATED).json({
      flag: 'success',
      data: {
        message: 'User Added successfully'
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(responseCodes.SERVER_ERROR).json({
      flag: 'error',
      error: 'Failed to create user'
    });
  }
};

/**
 * Create a new permission
 * POST /api/auth/permissions
 */
const addPermission = async (req, res) => {
  try {
    const { project, module, permission, description } = req.body;
    const currentUserId = req.user?.id || 'Admin';

    // Validation
    if (!project || !module || !permission) {
      return res.status(responseCodes.ERROR).json({
        flag: 'error',
        error: 'Project, module, and permission are required'
      });
    }

    // Build permission code
    const code = `${project.trim()}:${module.trim()}:${permission.trim()}`;
    
    // Check if permission code already exists
    const existingPermission = await Permission.findOne({ code });
    if (existingPermission) {
      return res.status(responseCodes.EXISTS).json({
        flag: 'error',
        error: `Permission "${code}" already exists`
      });
    }

    // Create new permission
    const newPermission = new Permission({
      project: project.trim(),
      module: module.trim(),
      permission: permission.trim(),
      description: description?.trim(),
      createdBy: currentUserId,
      updatedBy: currentUserId
    });

    const savedPermission = await newPermission.save();

    const response = {
      id: savedPermission._id,
      project: savedPermission.project,
      module: savedPermission.module,
      permission: savedPermission.permission,
      code: savedPermission.code,
      description: savedPermission.description,
      createdBy: 'Admin',
      createdAt: savedPermission.createdAt
    };

    res.status(responseCodes.CREATED).json({
      flag: 'success',
      data: response
    });

  } catch (error) {
    console.error('Error creating permission:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(responseCodes.ERROR).json({
        flag: 'error',
        error: validationErrors.join(', ')
      });
    }

    // Handle duplicate code error
    if (error.code === 11000) {
      return res.status(responseCodes.EXISTS).json({
        flag: 'error',
        error: `Permission code already exists`
      });
    }

    res.status(responseCodes.SERVER_ERROR).json({
      flag: 'error',
      error: 'Failed to create permission'
    });
  }
};

/**
 * Delete permission (soft delete)
 * DELETE /api/auth/permissions/:id
 */
const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    const permission = await Permission.findById(id);
    if (!permission) {
      return res.status(responseCodes.NOT_FOUND).json({
        flag: 'error',
        error: 'Permission not found'
      });
    }

    // Check if permission is assigned to any users
    const usersWithPermission = await agentUserDetails.findOne({
      roles: permission.code,
      isActive: true
    });

    if (usersWithPermission) {
      return res.status(responseCodes.ERROR).json({
        flag: 'error',
        error: 'Cannot delete permission - currently assigned to users'
      });
    }

    // Soft delete
    permission.isActive = false;
    permission.updatedBy = currentUserId;
    await permission.save();

    res.status(responseCodes.SUCCESS).json({
      flag: 'success',
      data: {
        message: 'Permission deleted successfully'
      }
    });

  } catch (error) {
    console.error('Error deleting permission:', error);

    res.status(responseCodes.SERVER_ERROR).json({
      flag: 'error',
      error: 'Failed to delete permission'
    });
  }
};

/**
 * Delete user (hard delete)
 * DELETE /auth/delete-user?username=xxx
 */
const deleteUserDetails = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(responseCodes.ERROR).json({
        flag: 'error',
        error: 'Username is required'
      });
    }

    const user = await agentUserDetails.findOne({ username });
    if (!user) {
      return res.status(responseCodes.NOT_FOUND).json({
        flag: 'error',
        error: 'User not found'
      });
    }

    // Hard delete - completely remove from database
    await agentUserDetails.deleteOne({ username });

    res.status(responseCodes.SUCCESS).json({
      flag: 'success',
      data: {
        message: 'User deleted successfully'
      }
    });

  } catch (error) {
    console.error('Error deleting user:', error);

    res.status(responseCodes.SERVER_ERROR).json({
      flag: 'error',
      error: 'Failed to delete user'
    });
  }
};

async function updatePermission(req, res) {
  try {

     const {username,roles:permissions} = req.body
     console.log('permission',permissions)
    console.log('username>>',username)
   
   const result =  await agentUserDetails.updateOne(
  { username: username },   
  { $pull: { roles:{$in:permissions} } } 
   );
   if(result.modifiedCount>0){
    res.status(responseCodes.SUCCESS).json({flag: "success", message: 'User permission updated successfully' });
   }else{
    res.status(responseCodes.NOT_FOUND).json({flag: "fail", message: 'Permission does not exist' });
   }

  } catch (err) {
    res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: err.message });
  }  
}

/**
 * Get permission matrix for user (Assign Permission Modal)
 * GET /api/auth/users/:id/permission-matrix
 */
const getUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user details
    const user = await agentUserDetails.findById(id).lean();
    if (!user) {
      return res.status(404).json({
        flag: 'error',
        error: 'User not found'
      });
    }

    // Get grouped permissions with user's current assignments
    const projects = await Permission.getGroupedPermissions(user.roles || []);

    const response = {
      user: {
        id: user._id,
        username: user.username
      },
      projects
    };

    res.status(responseCodes.SUCCESS).json({
      flag: 'success',
      data: response
    });

  } catch (error) {
    console.error('Error fetching user permission :', error);

    res.status(responseCodes.SERVER_ERROR).json({
      flag: 'error',
      error: 'Failed to fetch permission '
    });
  }
};

/**
 * Assign permissions to user
 * PUT /api/auth/users/:id/permissions
 */
const assignUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { codes = [] } = req.body;
    const currentUserId = req.user?.id;

    // Validation
    if (!Array.isArray(codes)) {
      return res.status(responseCodes.ERROR).json({
        flag: 'error',
        error: 'Codes must be an array'
      });
    }

    // Get user
    const user = await agentUserDetails.findById(id);
    if (!user) {
      return res.status(responseCodes.NOT_FOUND).json({
        flag: 'error',
        error: 'User not found'
      });
    }

    // Validate permission codes exist
    if (codes.length > 0) {
      const validation = await Permission.validateCodes(codes);
      if (!validation.valid) {
        return res.status(responseCodes.ERROR).json({
          flag: 'error',
          error: `Invalid permission codes: ${validation.invalidCodes.join(', ')}`
        });
      }
    }

    // Update user permissions
    user.roles = codes;
    user.updatedBy = currentUserId;
    
    const updatedUser = await user.save();
    await updatedUser.populate('updatedBy', 'username');

    const response = {
      userId: updatedUser._id,
      roles: updatedUser.roles,
      rolesCount: updatedUser.rolesCount,
      updatedBy: updatedUser.updatedBy?.username || 'Admin',
      updatedAt: updatedUser.updatedAt
    };

    res.status(responseCodes.SUCCESS).json({
      flag: 'success',
      data: response
    });

  } catch (error) {
    console.error('Error assigning user permissions:', error);

    res.status(responseCodes.SERVER_ERROR).json({
      flag: 'error',
      error: 'Failed to assign permissions'
    });
  }
};

module.exports = {getUserDetails,getPermissions,addUser,addPermission,deletePermission,deleteUserDetails,updatePermission,getUserPermissions,assignUserPermissions}