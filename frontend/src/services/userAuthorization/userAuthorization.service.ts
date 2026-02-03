import Cookies from "universal-cookie";
import axios from "axios";
import Config from "../../config/config";
import { getLocalAccessToken } from "../../utils/TokenUtils";
import AxiosInstanceClass from "../axiosInstance";
import { UserFilters } from "../../types/UserAuthorization";

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
const userAuthConfig = Config.apiEndpoints.userAuthorization as UserAuthConfig;
const userAuthBaseURL = userAuthConfig?.baseURL || process.env.REACT_APP_USER_AUTH_URL || "http://localhost:3001";
const cookies = new Cookies();
const accessToken = cookies.get("iasphere_access_token");
export const AxiosInstance = new AxiosInstanceClass(userAuthBaseURL).init(accessToken);

function handleAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response;
  }
  return { status: 500, data: { message: "Unexpected error occurred" } };
}

const fetchUsers = async (filters?: UserFilters) => {
  try {
    const params = {
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      search: filters?.search || "",
    };

    const response = await AxiosInstance.get(`${userAuthConfig.get.users}`, { params });
    console.log("response users", response);

    return response;
  } catch (error: any) {
    return handleAxiosError(error);
  }
};

const createUser = async (userData: any) => {
  try {
    const response = await AxiosInstance.post(`${userAuthConfig.post.createUser}`, userData);
    return response;
  } catch (error: any) {
    return handleAxiosError(error);
  }
};

const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await AxiosInstance.delete(`/api/users/${userId}`, userData);
    return response;
  } catch (error: any) {
    return handleAxiosError(error);
  }
};

const deleteUser = async (username: any) => {
  try {
    const response = await AxiosInstance.delete(`${userAuthConfig.delete.deleteUser}?username=${username}`);
    return response;
  } catch (error: any) {
    return handleAxiosError(error);
  }
};

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
    return handleAxiosError(error);
  }
};

const fetchPermissions = async (filters?: { page?: number; limit?: number; project?: string; module?: string; permission?: string }) => {
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
    return handleAxiosError(error);
  }
};

const createPermission = async (permissionData: { project: string; module: string; permission: string; description?: string }) => {
  try {
    const endpoint = userAuthConfig.post.createPermission;
    const response = await AxiosInstance.post(endpoint, permissionData);
    return response;
  } catch (error: any) {
    return handleAxiosError(error);
  }
};

const deletePermission = async (permissionId: string) => {
  try {
    const endpoint = `${userAuthConfig.delete.deletePermission}/${permissionId}`;
    const response = await AxiosInstance.delete(endpoint);
    return response;
  } catch (error: any) {
    return handleAxiosError(error);
  }
};

const assignUserPermissions = async (userId: string, permissionCodes: string[]) => {
  try {
    const endpoint = `${userAuthConfig.put.assignPermissions}/${userId}/permissions`;
    const response = await AxiosInstance.put(endpoint, { codes: permissionCodes });
    return response;
  } catch (error: any) {
    return handleAxiosError(error);
  }
};

const fetchGlobalPermissions = async (userId: string): Promise<any> => {
  try {
    const endpoint = `${userAuthConfig.get.permissionMatrix}/${userId}/user-permissions`;
    const response = await AxiosInstance.get(endpoint);
    return response;
  } catch (error: any) {
    return handleAxiosError(error);
  }
};

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
