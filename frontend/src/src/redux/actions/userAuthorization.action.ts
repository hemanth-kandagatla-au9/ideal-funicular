

import { AUTH } from "../../config/actions";
import { UserFilters } from "../../types/UserAuthorization";
export interface PermissionAssignment {
  project: string;
  module: string;
  role: string;
}

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


const userAuthorizationActions = {
  fetchUsers,
  requestFetchUsers,
  successFetchUsers,
  failureFetchUsers,
  createUser,
  requestCreateUser,
  successCreateUser,
  failureCreateUser,
  updateUser,
  requestUpdateUser,
  successUpdateUser,
  failureUpdateUser,
  deleteUser,
  requestDeleteUser,
  successDeleteUser,
  failureDeleteUser,
  selectUser,
  selectAllUsers,
  clearSelectedUsers,
  fetchUserPermissionDetails,
  requestFetchUserPermissionDetails,
  successFetchUserPermissionDetails,
  failureFetchUserPermissionDetails,
  fetchPermissions,
  successFetchPermissions,
  failureFetchPermissions,
  createPermission,
  successCreatePermission,
  failureCreatePermission,
  deletePermission,
  successDeletePermission,
  failureDeletePermission,
  assignUserPermissions,
  requestAssignUserPermissions,
  successAssignUserPermissions,
  failureAssignUserPermissions,
  fetchGlobalPermissions,
  requestFetchGlobalPermissions,
  successFetchGlobalPermissions,
  failureFetchGlobalPermissions,
};

export default userAuthorizationActions;
