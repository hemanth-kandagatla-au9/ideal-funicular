/**
 * Importing dependencies.
 */
import Cookies from "universal-cookie";
import { AxiosResponse, AxiosError } from "axios";
import Config from "../../config/config";
import AxiosInstanceClass from "../axiosInstance";
import { getLocalAccessToken } from "../../utils/TokenUtils";

const { post, get, baseUrl } = Config.apiEndpoints.auth;
const cookies = new Cookies();
const accessToken = cookies.get("iasphere_access_token");
export const AxiosInstance = new AxiosInstanceClass(`${baseUrl}/`).init(accessToken);

// Define types for your permission data and responses
interface PermissionData {
  // Define the structure of your permission data here
  [key: string]: any;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  // Add other axios response properties as needed
}

interface ErrorResponse {
  data: {
    message?: string;
    error?: string;
    // Add other error response properties as needed
  };
  status?: number;
}

// function to create permission
const addPermission = async (permissionData: PermissionData): Promise<ApiResponse | ErrorResponse> => {
  try {
    const response: AxiosResponse = await AxiosInstance.post(`${post.addPermission}`, permissionData);
    return response.data;
  } catch (error) {
    const addPermissionErr = error as AxiosError;
    return addPermissionErr.response?.data || { error: addPermissionErr.message };
  }
};

// function to get permissions by group
const getPermissionsByGroup = async (groupId: string): Promise<ApiResponse | ErrorResponse> => {
  try {
    const response: AxiosResponse = await AxiosInstance.get(`${get.permissionsByGroup}/${groupId}`);
    return response.data;
  } catch (error) {
    const getPermissionsErr = error as AxiosError;
    return getPermissionsErr.response?.data || { error: getPermissionsErr.message };
  }
};

/**
 * Exporting permission service functions.
 */
const PermissionService = {
  addPermission,
  getPermissionsByGroup,
};

export default PermissionService;