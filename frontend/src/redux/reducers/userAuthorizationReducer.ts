/**
 * User Authorization Reducer
 * Manages user authorization state in Redux store
 * Uses AUTH.USER action types for consistency
 */

import { AUTH } from "../../config/actions";
import { UserAuthorizationState } from "../../types/UserAuthorization";

/**
 * Dummy Data for Development/Testing
 */
const dummyUsers = [
  {
    id: "user001",
    userName: "john.doe",
    isActive: true,
    rolesCount: 3,
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: "2024-12-01T10:30:00.000Z",
    updatedAt: "2024-12-15T14:20:00.000Z",
  },
  {
    id: "user002",
    userName: "jane.smith",
    isActive: true,
    rolesCount: 4,
    createdBy: "Admin",
    updatedBy: "john.doe",
    createdAt: "2024-11-15T08:45:00.000Z",
    updatedAt: "2024-12-10T16:10:00.000Z",
  },
  {
    id: "user003",
    userName: "mike.wilson",
    isActive: false,
    rolesCount: 1,
    createdBy: "Admin",
    updatedBy: "jane.smith",
    createdAt: "2024-10-20T12:00:00.000Z",
    updatedAt: "2024-11-25T09:30:00.000Z",
  },
];

const dummyPermissions = [
  {
    id: "perm001",
    project: "agent",
    module: "status",
    permission: "read",
    code: "agent:status:read",
    description: "View agent status and health information",
    isActive: true,
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z",
  },
  {
    id: "perm002",
    project: "agent",
    module: "status",
    permission: "update",
    code: "agent:status:update",
    description: "Update agent status (start, stop, restart)",
    isActive: true,
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z",
  },
  {
    id: "perm003",
    project: "agent",
    module: "metrics",
    permission: "read",
    code: "agent:metrics:read",
    description: "View agent performance metrics and statistics",
    isActive: true,
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z",
  },
  {
    id: "perm004",
    project: "agent",
    module: "config",
    permission: "read",
    code: "agent:config:read",
    description: "View agent configuration settings",
    isActive: true,
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z",
  },
  {
    id: "perm005",
    project: "agent",
    module: "config",
    permission: "update",
    code: "agent:config:update",
    description: "Modify agent configuration settings",
    isActive: true,
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z",
  },
  {
    id: "perm006",
    project: "agent",
    module: "logs",
    permission: "read",
    code: "agent:logs:read",
    description: "View agent logs and error messages",
    isActive: true,
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z",
  },
  {
    id: "perm007",
    project: "agent",
    module: "deployment",
    permission: "execute",
    code: "agent:deployment:execute",
    description: "Deploy and upgrade agent versions",
    isActive: true,
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z",
  },
  {
    id: "perm008",
    project: "agent",
    module: "deployment",
    permission: "rollback",
    code: "agent:deployment:rollback",
    description: "Rollback agent deployments",
    isActive: true,
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z",
  },
  {
    id: "perm009",
    project: "monitoring",
    module: "dashboard",
    permission: "read",
    code: "monitoring:dashboard:read",
    description: "View monitoring dashboards",
    isActive: true,
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z",
  },
  {
    id: "perm010",
    project: "monitoring",
    module: "alerts",
    permission: "manage",
    code: "monitoring:alerts:manage",
    description: "Manage monitoring alerts and notifications",
    isActive: true,
    createdBy: "Admin",
    updatedBy: "Admin",
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z",
  },
];

/**
 * Initial State with Dummy Data
 */
const initialState: UserAuthorizationState = {
  users: dummyUsers,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: dummyUsers.length,
  },
  selectedUsers: [],
  permissions: dummyPermissions,
  globalPermissions: null,
  permissionsPagination: {
    page: 1,
    limit: 10,
    total: dummyPermissions.length,
  },
};

/**
 * User Authorization Reducer
 * @param state Current state
 * @param action Dispatched action
 * @returns Updated state
 */
export default function userAuthorizationReducer(
  state = initialState,
  action: {
    type: string;
    [key: string]: any;
  },
) {
  switch (action.type) {
    // FETCH USERS
    case AUTH.USER.GET_USERS_REQUEST:
      // BYPASS: Keep dummy data and set loading to false since we're not making API calls
      return { ...state, loading: false, error: null };

    // FETCH USERS SUCCESS - Updates state with user list from backend
    // Transforms backend response format to frontend state format
    case AUTH.USER.GET_USERS_SUCCESS: {
      const backendData = action.data?.data?.data || {};
      const rawUsers = backendData.users || [];
      const backendPagination = backendData.pagination || {};
      
      const users = Array.isArray(rawUsers)
        ? rawUsers.map((user: any) => ({
            id: user.id,
            userName: user.username,
            isActive: user.isActive,
            rolesCount: user.rolesCount || 0,
            createdBy: user.createdBy || "Admin",
            updatedBy: user.updatedBy || "Admin",
            createdAt: user.createdAt || new Date().toISOString(),
            updatedAt: user.updatedAt || new Date().toISOString(),
          }))
        : [];
      
      return {
        ...state,
        loading: false,
        users,
        pagination: {
          page: backendPagination.page || 1,
          limit: backendPagination.limit || 10,
          total: backendPagination.total || 0,
        },
      };
    }

    case AUTH.USER.GET_USERS_FAILURE:
      return { ...state, loading: false, error: action.error };

    // CREATE USER REQUEST - Sets loading state
    case AUTH.USER.CREATE_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH.USER.CREATE_USER_SUCCESS:
      return { ...state, loading: false };

    case AUTH.USER.CREATE_USER_FAILURE:
      return { ...state, loading: false, error: action.error };

    // UPDATE USER
    case AUTH.USER.UPDATE_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH.USER.UPDATE_USER_SUCCESS:
      return { ...state, loading: false };

    case AUTH.USER.UPDATE_USER_FAILURE:
      return { ...state, loading: false, error: action.error };

    // DELETE USER REQUEST
    case AUTH.USER.DELETE_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH.USER.DELETE_USER_SUCCESS:
      return { ...state, loading: false };

    case AUTH.USER.DELETE_USER_FAILURE:
      return { ...state, loading: false, error: action.error };

    // USER SELECTION
    case AUTH.USER.SELECT_USER: {
      const { userId } = action;
      const isSelected = state.selectedUsers.includes(userId);
      return {
        ...state,
        selectedUsers: isSelected ? state.selectedUsers.filter((id: string) => id !== userId) : [...state.selectedUsers, userId],
      };
    }

    case AUTH.USER.SELECT_ALL_USERS:
      return {
        ...state,
        selectedUsers: action.userIds || [],
      };

    case AUTH.USER.CLEAR_SELECTED_USERS:
      return {
        ...state,
        selectedUsers: [],
      };

    
    case AUTH.PERMISSION.GET_PERMISSIONS_REQUEST:
      // BYPASS: Keep dummy data and set loading to false since we're not making API calls
      return { ...state, loading: false, error: null };

    case AUTH.PERMISSION.GET_PERMISSIONS_SUCCESS: {
      const backendData = action.data?.data?.data || {};
      const rawPermissions = backendData.permissions || [];
      const backendPagination = backendData.pagination || state.permissionsPagination;

      return {
        ...state,
        permissions: rawPermissions,
        permissionsPagination: backendPagination,
        loading: false,
        error: null,
      };
    }

    case AUTH.PERMISSION.GET_PERMISSIONS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case AUTH.PERMISSION.CREATE_PERMISSION_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH.PERMISSION.CREATE_PERMISSION_SUCCESS:
      return { ...state, loading: false, error: null };

    case AUTH.PERMISSION.CREATE_PERMISSION_FAILURE:
      return { ...state, loading: false, error: action.error };

    case AUTH.PERMISSION.DELETE_PERMISSION_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH.PERMISSION.DELETE_PERMISSION_SUCCESS:
      return { ...state, loading: false, error: null };

    case AUTH.PERMISSION.DELETE_PERMISSION_FAILURE:
      return { ...state, loading: false, error: action.error };

     // FETCH GLOBAL PERMISSIONS
    case AUTH.USER.FETCH_GLOBAL_PERMISSIONS_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH.USER.FETCH_GLOBAL_PERMISSIONS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        globalPermissions: action.data?.data?.data || null 
      };

    case AUTH.USER.FETCH_GLOBAL_PERMISSIONS_FAILURE:
      return { ...state, loading: false, error: action.error };


    default:
      return state;
  }
}
