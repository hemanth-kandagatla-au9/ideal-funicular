/**
 * USER AUTHORIZATION ACTIONS
 * Uses AUTH.USER action types for consistency with existing auth structure
 */

import { AUTH } from "../../config/actions";
import { UserFilters } from "../../types/UserAuthorization";
// Interface for permission assignment
export interface PermissionAssignment {
  project: string;
  module: string;
  role: string;
}
/**
 * Fetch Users Actions
 * Reuses existing GET_USERS actions from AUTH.USER
 * @param {UserFilters} props - Optional filters for fetching users
 * @returns Action object
 */
const fetchUsers = (props?: UserFilters) => ({
  type: AUTH.USER.GET_USERS_REQUEST,
  props,
});

const requestFetchUsers = () => ({
  type: AUTH.USER.GET_USERS_REQUEST,
});

const successFetchUsers = (data: any) => ({
  type: AUTH.USER.GET_USERS_SUCCESS,
  data,
});

const failureFetchUsers = (error: { message: string }) => ({
  type: AUTH.USER.GET_USERS_FAILURE,
  error: error.message || "",
});

/**
 * Create User Actions
 * @param {object} props - User data to create
 * @returns Action object
 */
const createUser = (props: any) => ({
  type: AUTH.USER.CREATE_USER_REQUEST,
  props,
});

const requestCreateUser = () => ({
  type: AUTH.USER.CREATE_USER_REQUEST,
});

const successCreateUser = (data: any) => ({
  type: AUTH.USER.CREATE_USER_SUCCESS,
  data,
});

const failureCreateUser = (error: { message: string }) => ({
  type: AUTH.USER.CREATE_USER_FAILURE,
  error: error.message || "",
});

/**
 * Update User Actions
 * Reuses existing UPDATE_USER actions from AUTH.USER
 * @param {object} props - User data to update (must include id)
 * @returns Action object
 */
const updateUser = (props: any) => ({
  type: AUTH.USER.UPDATE_USER_REQUEST,
  props,
});

const requestUpdateUser = () => ({
  type: AUTH.USER.UPDATE_USER_REQUEST,
});

const successUpdateUser = (data: any) => ({
  type: AUTH.USER.UPDATE_USER_SUCCESS,
  data,
});

const failureUpdateUser = (error: { message: string }) => ({
  type: AUTH.USER.UPDATE_USER_FAILURE,
  error: error.message || "",
});

/**
 * Delete User Actions
 * @param {string} username - Username of user to delete
 * @returns Action object
 */
const deleteUser = (username: string) => ({
  type: AUTH.USER.DELETE_USER_REQUEST,
  username,
});

const requestDeleteUser = () => ({
  type: AUTH.USER.DELETE_USER_REQUEST,
});

const successDeleteUser = (data: any) => ({
  type: AUTH.USER.DELETE_USER_SUCCESS,
  data,
});

const failureDeleteUser = (error: { message: string }) => ({
  type: AUTH.USER.DELETE_USER_FAILURE,
  error: error.message || "",
});

/**
 * User Selection Actions
 * For checkbox selection in the table
 */
const selectUser = (userId: string) => ({
  type: AUTH.USER.SELECT_USER,
  userId,
});

const selectAllUsers = (userIds: string[]) => ({
  type: AUTH.USER.SELECT_ALL_USERS,
  userIds,
});

const clearSelectedUsers = () => ({
  type: AUTH.USER.CLEAR_SELECTED_USERS,
});


/**
 * Fetch User Permission Details Actions
 * @param {string} username - Username to fetch permissions for
 * @param {object} filters - Optional filters for pagination
 * @returns Action object
 */
const fetchUserPermissionDetails = (username: string, filters?: { page?: number; limit?: number }) => ({
  type: AUTH.USER.GET_USER_PERMISSION_DETAILS_REQUEST,
  username,
  filters,
});

const requestFetchUserPermissionDetails = () => ({
  type: AUTH.USER.GET_USER_PERMISSION_DETAILS_REQUEST,
});

const successFetchUserPermissionDetails = (data: any) => ({
  type: AUTH.USER.GET_USER_PERMISSION_DETAILS_SUCCESS,
  data,
});

const failureFetchUserPermissionDetails = (error: { message: string }) => ({
  type: AUTH.USER.GET_USER_PERMISSION_DETAILS_FAILURE,
  error: error.message || "",
});


/**
 * Fetch Permissions List Actions
 * @param {object} filters - Filter parameters (page, limit, project, module, permission)
 * @returns Action object
 */
const fetchPermissions = (filters: any) => ({
  type: AUTH.PERMISSION.GET_PERMISSIONS_REQUEST,
  filters,
});

const successFetchPermissions = (data: any) => ({
  type: AUTH.PERMISSION.GET_PERMISSIONS_SUCCESS,
  data,
});

const failureFetchPermissions = (error: any) => ({
  type: AUTH.PERMISSION.GET_PERMISSIONS_FAILURE,
  error,
});

/**
 * Create Permission Actions
 * @param {object} permissionData - Permission data (project, module, permission, description)
 * @returns Action object
 */
const createPermission = (permissionData: any) => ({
  type: AUTH.PERMISSION.CREATE_PERMISSION_REQUEST,
  permissionData,
});

const successCreatePermission = (data: any) => ({
  type: AUTH.PERMISSION.CREATE_PERMISSION_SUCCESS,
  data,
});

const failureCreatePermission = (error: any) => ({
  type: AUTH.PERMISSION.CREATE_PERMISSION_FAILURE,
  error,
});

/**
 * Delete Permission Actions
 * @param {string} permissionId - ID of permission to delete
 * @returns Action object
 */
const deletePermission = (permissionId: string) => ({
  type: AUTH.PERMISSION.DELETE_PERMISSION_REQUEST,
  permissionId,
});

const successDeletePermission = (data: any) => ({
  type: AUTH.PERMISSION.DELETE_PERMISSION_SUCCESS,
  data,
});

const failureDeletePermission = (error: any) => ({
  type: AUTH.PERMISSION.DELETE_PERMISSION_FAILURE,
  error,
});

/**
 * Assign User Permissions Actions
 * @param {string} userId - User ID to assign permissions to
 * @param {string[]} permissionCodes - Array of permission codes
 * @returns Action object
 */
const assignUserPermissions = (userId: string, permissionCodes: string[]) => ({
  type: AUTH.USER.ASSIGN_USER_PERMISSIONS_REQUEST,
  userId,
  permissionCodes,
});

const requestAssignUserPermissions = () => ({
  type: AUTH.USER.ASSIGN_USER_PERMISSIONS_REQUEST,
});

const successAssignUserPermissions = (data: any) => ({
  type: AUTH.USER.ASSIGN_USER_PERMISSIONS_SUCCESS,
  data,
});

const failureAssignUserPermissions = (error: { message: string }) => ({
  type: AUTH.USER.ASSIGN_USER_PERMISSIONS_FAILURE,
  error: error.message || "",
});

/**
 * Fetch Global Permissions Actions
 * @param {string} userId - User ID to fetch permission matrix for
 * @returns Action object
 */
const fetchGlobalPermissions = (userId: string) => ({
  type: AUTH.USER.FETCH_GLOBAL_PERMISSIONS_REQUEST,
  userId,
});

const requestFetchGlobalPermissions = () => ({
  type: AUTH.USER.FETCH_GLOBAL_PERMISSIONS_REQUEST,
});

const successFetchGlobalPermissions = (data: any) => ({
  type: AUTH.USER.FETCH_GLOBAL_PERMISSIONS_SUCCESS,
  data,
});

const failureFetchGlobalPermissions = (error: { message: string }) => ({
  type: AUTH.USER.FETCH_GLOBAL_PERMISSIONS_FAILURE,
  error: error.message || "",
});

/**
 * Exported All User Authorization Actions
 */
const userAuthorizationActions = {
  // Fetch Users
  fetchUsers,
  requestFetchUsers,
  successFetchUsers,
  failureFetchUsers,

  // Create User
  createUser,
  requestCreateUser,
  successCreateUser,
  failureCreateUser,

  // Update User
  updateUser,
  requestUpdateUser,
  successUpdateUser,
  failureUpdateUser,

  // Delete User
  deleteUser,
  requestDeleteUser,
  successDeleteUser,
  failureDeleteUser,

  // User Selection
  selectUser,
  selectAllUsers,
  clearSelectedUsers,

  
  // User Permission Details
  fetchUserPermissionDetails,
  requestFetchUserPermissionDetails,
  successFetchUserPermissionDetails,
  failureFetchUserPermissionDetails,

  
  // Permission List Management
  fetchPermissions,
  successFetchPermissions,
  failureFetchPermissions,
  createPermission,
  successCreatePermission,
  failureCreatePermission,
  deletePermission,
  successDeletePermission,
  failureDeletePermission,

    // Assign User Permissions
  assignUserPermissions,
  requestAssignUserPermissions,
  successAssignUserPermissions,
  failureAssignUserPermissions,

  // Fetch Global Permissions
  fetchGlobalPermissions,
  requestFetchGlobalPermissions,
  successFetchGlobalPermissions,
  failureFetchGlobalPermissions,
};

export default userAuthorizationActions;
