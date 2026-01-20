/**
 * User Authorization Service
 * API service for user management operations
 */

import axios from "axios";
import Config from "../../config/config";
import { getLocalAccessToken } from "../../utils/TokenUtils";
import AxiosInstanceClass from "../axiosInstance";
import { UserFilters } from "../../types/UserAuthorization";

/**
 * Getting Local Access token
 */
const token = getLocalAccessToken();


interface EndpointGroup {
  [key: string]: string;
}

interface UserAuthConfig {
  baseURL: string;
  get: EndpointGroup;
  post: EndpointGroup;
  patch: EndpointGroup;
  put: EndpointGroup;
  delete: EndpointGroup;
}

// API Configuration
const userAuthConfig = Config.apiEndpoints.userAuthorization as UserAuthConfig;
const userAuthBaseURL = userAuthConfig?.baseURL || process.env.REACT_APP_USER_AUTH_URL || "http://localhost:3001";

// Initialize Axios instance
export const AxiosInstance = new AxiosInstanceClass(userAuthBaseURL).init(token);

function handleAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response;
  }
  return { status: 500, data: { message: "Unexpected error occurred" } };
}

/**
 * Fetch Users
 * @param {UserFilters} filters - Optional filters (page, limit, search)
 * @returns Promise with user data from API
 */
const fetchUsers = async (filters?: UserFilters) => {
  try {
    const params = {
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      search: filters?.search || "",
    };

    const response = await AxiosInstance.get(`${userAuthConfig.get.users}`, { params });
    console.log(`response users`,response);
    
    return response;
  } catch (error: any) {
    return handleAxiosError(error) 
  }
};

/**
 * Create User
 * @param {object} userData - User data to create
 * @returns Promise with created user response
 */
const createUser = async (userData: any) => {
  try {
    const response = await AxiosInstance.post(`${userAuthConfig.post.createUser}`, userData);
    return response;
  } catch (error: any) {
    return handleAxiosError(error)
  }
};

/**
 * Update User
 * @param {string} userId - ID of user to update
 * @param {object} userData - Updated user data
 * @returns Promise with updated user response
 */
const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await AxiosInstance.delete(`/api/users/${userId}`, userData);
    return response;
  } catch (error: any) {
    return handleAxiosError(error)
  }
};


/**
 * Delete User
 * @param {string} username - Username of user to delete
 * @returns Promise with delete confirmation response
 */
const deleteUser = async (username: any) => {
  try {
    const response = await AxiosInstance.delete(`${userAuthConfig.delete.deleteUser}?username=${username}`);
    return response;
  } catch (error: any) {
    return handleAxiosError(error)
  }
};


/**
 * Fetch User Permission Details
 * @param {string} username - Username to fetch permissions for
 * @param {object} filters - Optional filters (page, limit)
 * @returns Promise with permission details for the user
 */
const fetchUserPermissionDetails = async (username: string, filters?: { page?: number; limit?: number }) => {
  try {
    const params = {
      username,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
    };

    const response = await AxiosInstance.get(`${userAuthConfig.get.userPermissionsList}`, { params });
    return response;
  } catch (error: any) {
    return handleAxiosError(error)
  }
};


/**
 * Fetch Permissions (Real API)
 * @param {object} filters - Optional filters (page, limit, project, module, permission)
 * @returns Promise with permissions data from backend
 */
const fetchPermissions = async (filters?: {
  page?: number;
  limit?: number;
  project?: string;
  module?: string;
  permission?: string;
}) => {
  try {
    
    const params = {
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      project: filters?.project || "",
      module: filters?.module || "",
      permission: filters?.permission || "",
    };
    
    const response = await AxiosInstance.get(`${userAuthConfig.get.PermissionsList}`, { params });
    return response;
  } catch (error: any) {
    return handleAxiosError(error)
  }
};

/**
 * Create Permission (Real API)
 * @param {object} permissionData - Permission data (project, module, permission, description)
 * @returns Promise with created permission response
 */
const createPermission = async (permissionData: {
  project: string;
  module: string;
  permission: string;
  description?: string;
}) => {
  try {
    const endpoint = userAuthConfig.post.createPermission;
    const response = await AxiosInstance.post(endpoint, permissionData);
    return response;
  } catch (error: any) {
    return handleAxiosError(error)
  }
};

/**
 * Delete Permission (Real API)
 * @param {string} permissionId - ID of permission to delete
 * @returns Promise with delete confirmation response
 */
const deletePermission = async (permissionId: string) => {
  try {
    const endpoint = `${userAuthConfig.delete.deletePermission}/${permissionId}`;
    const response = await AxiosInstance.delete(endpoint);
    return response;
  } catch (error: any) {
    return handleAxiosError(error)
  }
};

/**
 * Assign User Permissions (Real API)
 * @param {string} userId - User ID to assign permissions to
 * @param {string[]} permissionCodes - Array of permission codes like ["agent:status:read", ...]
 * @returns Promise with assignment response from API
 */
const assignUserPermissions = async (userId: string, permissionCodes: string[]) => {
  try {
    const endpoint = `${userAuthConfig.put.assignPermissions}/${userId}/permissions`;
    const response = await AxiosInstance.put(endpoint, { codes: permissionCodes });
    return response;
  } catch (error: any) {
    return handleAxiosError(error)
  }
};

/**
 * Fetch Global Permissions List (Real API)
 * @param {string} userId - User ID to get permission matrix for
 * @returns Promise with global permissions list with user's current selections
 */
const fetchGlobalPermissions = async (userId: string): Promise<any> => {
  try {
    const endpoint = `${userAuthConfig.get.permissionMatrix}/${userId}/user-permissions`;
    const response = await AxiosInstance.get(endpoint);
    return response;
  } catch (error: any) {
    return handleAxiosError(error)
  }
};
/**
 * Exported service methods
 */
const userAuthorizationService = {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchUserPermissionDetails,
  fetchPermissions,
  createPermission,
  deletePermission,
  assignUserPermissions,
  fetchGlobalPermissions,
};

export default userAuthorizationService;
