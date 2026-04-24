
import Cookies from "universal-cookie";
import Config from "../../config/config";
import { getLocalAccessToken } from "../../utils/TokenUtils";
import AxiosInstanceClass from "../axiosInstance";

const authEndpoints = Config.apiEndpoints?.auth || {};
const baseUrl = authEndpoints.baseUrl || "";
const getEndpoints = authEndpoints.get || {};
const patchEndpoints = authEndpoints.patch || {};
const postEndpoints = authEndpoints.post || {};
const delEndpoints = authEndpoints.del || {};
const cookies = new Cookies();
let _instance: ReturnType<AxiosInstanceClass["init"]> | null = null;

export const getAxiosInstance = async () => {
  if (_instance) return _instance;
  _instance = new AxiosInstanceClass(baseUrl).init();
  return _instance;
};

interface UserData {
  id: string;
  [key: string]: any;
}
interface ApplicationData {
  id?: string;
  appName?: string;
  isBlocked?: boolean;
  [key: string]: any;
}
interface ListParams {
  filter?: string;
  pagination: {
    limit: number;
    pageNo: number;
  };
}
interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
}
interface ErrorResponse {
  response?: {
    data?: any;
    status?: number;
    statusText?: string;
  };
  message?: string;
}


const getUserById = async (userId: string): Promise<UserData | ApiResponse> => {
  try {
    if (!getEndpoints.users) throw new Error("Users endpoint not configured");

    const cookies = new Cookies();
    const accessToken = cookies.get("token");
    const instance = await getAxiosInstance();
    const response = await instance.get(`${getEndpoints.users}${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response?.data?.data || {};
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return err?.response?.data || { success: false, message: "Failed to fetch user" };
  }
};


const logout = async (userId: string | null): Promise<ApiResponse> => {
  try {
    if (!patchEndpoints.logout) throw new Error("Logout endpoint not configured");

    const cookies = new Cookies();
    const accessToken = cookies.get("token");
    const instance = await getAxiosInstance();
    const response = await instance.patch(`${patchEndpoints.logout}/${userId}`, null, { headers: { Authorization: `Bearer ${accessToken}` }});
    return response?.data?.data || { success: true, message: "Logged out successfully" };
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return err?.response?.data || { success: false, message: "Logout failed" };
  }
};


const modifyUser = async (userId: string, body: Partial<UserData>): Promise<UserData | ApiResponse> => {
  try {
    if (!patchEndpoints.updateUser) throw new Error("Update user endpoint not configured");

    const cookies = new Cookies();
    const accessToken = cookies.get("token");
    const instance = await getAxiosInstance();
    const response = await instance.patch(`${patchEndpoints.updateUser}/${userId}`, body, { headers: { token: `Bearer ${accessToken}` } });
    return response?.data?.data || {};
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return err?.response?.data || { success: false, message: "User update failed" };
  }
};


const addApplication = async (applicationData: ApplicationData): Promise<ApiResponse> => {
  try {
    if (!postEndpoints.addApplication) throw new Error("Add application endpoint not configured");
    const instance = await getAxiosInstance();
    const response = await instance.post(postEndpoints.addApplication, applicationData, { headers: { Authorization: `Bearer ${getLocalAccessToken()}` } });
    return response?.data || { success: true, message: "Application added successfully" };
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return err?.response?.data || { success: false, message: "Failed to add application" };
  }
};


const updateApplication = async (id: string, applicationData: Partial<ApplicationData>): Promise<ApiResponse> => {
  try {
    if (!patchEndpoints.updateApplication) throw new Error("Update application endpoint not configured");
    const instance = await getAxiosInstance();
    const response = await instance.patch(`${patchEndpoints.updateApplication}${id}`, applicationData, { headers: { Authorization: `Bearer ${getLocalAccessToken()}` } });
    return response?.data || { success: true, message: "Application updated successfully" };
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return err?.response?.data || { success: false, message: "Failed to update application" };
  }
};


const deleteApplication = async (id: string): Promise<ApiResponse> => {
  try {
    if (!delEndpoints.deleteApplication) throw new Error("Delete application endpoint not configured");
const instance = await getAxiosInstance();
    const response = await instance.delete(`${delEndpoints.deleteApplication}/${id}`, { headers: { Authorization: `Bearer ${getLocalAccessToken()}` } });
    return response?.data || { success: true, message: "Application deleted successfully" };
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return err?.response?.data || { success: false, message: "Failed to delete application" };
  }
};


const blockApplication = async (id: string, data: { isBlocked: boolean }): Promise<ApiResponse> => {
  try {
    if (!patchEndpoints.blockApplication) throw new Error("Block application endpoint not configured");
const instance = await getAxiosInstance();
    const response = await instance.patch(`${patchEndpoints.blockApplication}/${id}`, data, { headers: { Authorization: `Bearer ${getLocalAccessToken()}` } });
    return response?.data || { success: true, message: data.isBlocked ? "Application blocked successfully" : "Application unblocked successfully" };
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return err?.response?.data || { success: false, message: "Failed to update application block status" };
  }
};


const listApplication = async (listParam: ListParams): Promise<ApiResponse> => {
  try {
    if (!getEndpoints.applicationList) throw new Error("Application list endpoint not configured");

    const { filter, pagination } = listParam;
    const { limit, pageNo } = pagination;
    const url = !filter ? `${getEndpoints.applicationList}?limit=${limit}&pageNo=${pageNo}` : `${getEndpoints.applicationList}?limit=${limit}&pageNo=${pageNo}&appName=${filter}`;
const instance = await getAxiosInstance();
    const response = await instance.get(url, {
      headers: { Authorization: `Bearer ${getLocalAccessToken()}` },
    });
    return response?.data || { data: [], success: true };
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return err?.response?.data || { success: false, message: "Failed to list applications", data: [] };
  }
};


const getAuthAuditLogForCSV = async (filter: Record<string, any> = {}): Promise<ApiResponse> => {
  try {
    if (!getEndpoints.getAuditLogForCSV) throw new Error("Audit log endpoint not configured");
const instance = await getAxiosInstance();
    const filterParams = new URLSearchParams(filter).toString();
    const response = await instance.get(filterParams ? `${getEndpoints.getAuditLogForCSV}?${filterParams}` : getEndpoints.getAuditLogForCSV, {
      headers: { Authorization: `Bearer ${getLocalAccessToken()}` },
    });
    return response?.data || { success: true, data: [] };
  } catch (error: unknown) {
    const err = error as ErrorResponse;
    return err?.response?.data || { success: false, message: "Failed to get audit logs", data: [] };
  }
};


const AuthService = {
  getUserById,
  logout,
  modifyUser,
  addApplication,
  listApplication,
  updateApplication,
  deleteApplication,
  blockApplication,
  getAuthAuditLogForCSV
};

export default AuthService;
