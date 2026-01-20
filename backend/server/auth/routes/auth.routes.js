const express = require('express');
const router = express.Router();
const { 
  generateTokenEndpoint, 
  validateTokenEndpoint, 
  healthCheck 
} = require('../controllers/tokenController');
const { getUserDetails,getPermissions,addUser,addPermission,deletePermission,deleteUserDetails,updatePermission,getUserPermissions,assignUserPermissions } =  require('../controllers/authManagementController')



/**
 * Authentication Routes
 * Defines all routes for the JWT authentication system
 */

/**
 * GET /auth/generate-token
 * Generate a new JWT token with static username
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Token generated successfully",
 *   "data": {
 *     "token": "eyJhbGciOiJSUzI1NiIs...",
 *     "tokenType": "Bearer"
 *   }
 * }
 */
router.get('/generate-token', generateTokenEndpoint);

/**
 * POST /auth/validate-token
 * Validate a JWT token using token header
 * 
 * Required Header:
 * token: Bearer eyJhbGciOiJSUzI1NiIs...
 * 
 * Success Response:
 * {
 *   "success": true,
 *   "message": "Token is valid",
 *   "data": {
 *     "valid": true,
 *     "payload": {
 *       "username": "risebot-service"
 *     },
 *     "tokenLength": 245,
 *     "validationTimestamp": "2025-10-22T14:30:00.000Z"
 *   }
 * }
 */
router.post('/validate-token', validateTokenEndpoint);

/**
 * GET /auth/health
 * Health check endpoint for authentication service
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Authentication service is healthy",
 *   "data": {
 *     "status": "healthy",
 *     "timestamp": "2025-10-13T14:30:00.000Z",
 *     "ssmKeys": "accessible",
 *     "service": "risebot-auth-service",
 *     "version": "1.0.0"
 *   }
 * }
 */
router.get('/health', healthCheck);
router.get('/user-details',getUserDetails)
router.get('/permissionsList',getPermissions)
router.post('/add-user',addUser)
router.delete('/delete-user',deleteUserDetails)
router.post('/add-permission',addPermission)
router.delete('/permissions/:id', deletePermission)
router.post('/update-permission',updatePermission)
router.get('/users/:id/user-permissions', getUserPermissions)
router.put('/users/:id/permissions', assignUserPermissions);



module.exports = router;