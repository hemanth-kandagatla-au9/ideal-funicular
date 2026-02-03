import Cookies from "universal-cookie";
import Config from "../../config/config";
import AxiosInstanceClass from "../axiosInstance";
import { getLocalAccessToken } from "../../utils/TokenUtils";

const { patch, get, baseUrl } = Config.apiEndpoints.auth;
const cookies = new Cookies();
const accessToken = cookies.get("iasphere_access_token");
export const AxiosInstance = new AxiosInstanceClass(`${baseUrl}/`).init(accessToken);
interface Pagination {
  limit: number;
  pageNo: number;
}

interface Filter {
  name?: string;
  group?: string | null;
  isLoggedIn?: boolean | null;
}

interface GetUsersPayload {
  filter?: Filter;
  pagination: Pagination;
}

interface ExportUsersPayload {
  filter?: Filter;
}

interface UsersActivityLogPayload {
  filter?: Record<string, any>;
  pagination: Pagination;
}

interface UserData {
  user: any;
  permissions: Record<string, Record<string, any>>;
}

interface ApiResponse {
  data: any; // Replace 'any' with specific response structure if known
  [key: string]: any;
}
const getUsers = async (payload: GetUsersPayload): Promise<ApiResponse> => {
  try {
    const { filter, pagination } = payload;
    let url =
      filter && !filter.name
        ? `${get.users}?limit=${pagination.limit}&pageNo=${pagination.pageNo}`
        : `${get.users}?limit=${pagination.limit}&pageNo=${pagination.pageNo}&name=${filter?.name}`;

    if (filter?.group) {
      url += `&memberOf=${filter.group}`;
    }
    if (filter?.isLoggedIn != null) {
      url += `&isLoggedIn=${filter.isLoggedIn}`;
    }
    const response = await AxiosInstance.get(`${url}`);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};
const getUser = async (userId: string, accessToken?: string): Promise<UserData> => {
  try {
    let response: any;
    if (accessToken) {
      response = await AxiosInstance.get(`${get.users}${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } else {
      response = await AxiosInstance.get(`${get.users}${userId}`);
    }
    return response.data.data;
  } catch (error: any) {
    return error;
  }
};
const updateUser = async (id: string, data: any): Promise<ApiResponse> => {
  try {
    const response = await AxiosInstance.patch(`${patch.updateUser}/${id}`, data);
    return response.data;
  } catch (updateUserErr: any) {
    return updateUserErr.response.data;
  }
};
const exportUsers = async (payload: ExportUsersPayload): Promise<ApiResponse> => {
  try {
    const { filter } = payload;
    const cleanedFilter = { ...filter };

    if (cleanedFilter && (cleanedFilter.isLoggedIn === null || cleanedFilter.isLoggedIn === undefined)) {
      delete cleanedFilter.isLoggedIn;
    }
    if (cleanedFilter && (cleanedFilter.group === null || cleanedFilter.group === undefined)) {
      delete cleanedFilter.group;
    }

    const filterParams = new URLSearchParams(cleanedFilter as Record<string, string>).toString();
    const response = await AxiosInstance.get(filterParams ? `${get.usersExport}?${filterParams}` : get.usersExport);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};
const getUsersActivityLog = async (payload: UsersActivityLogPayload): Promise<ApiResponse> => {
  try {
    const { filter, pagination } = payload;
    const filterParams = new URLSearchParams({ ...filter, ...pagination } as Record<string, string>).toString();
    const response = await AxiosInstance.get(filterParams ? `${get.usersActivityLog}?${filterParams}` : `${get.usersActivityLog}`);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};
const getUsersActivityLogExport = async (filter: Record<string, any>): Promise<ApiResponse> => {
  try {
    const filterParams = new URLSearchParams(filter).toString();
    const response = await AxiosInstance.get(filterParams ? `${get.usersActivityLog}/export?${filterParams}` : `${get.usersActivityLog}/export`);

    if (response.data?.data?.usersActivityLog) {
      response.data.data.usersActivityLog = response.data.data.usersActivityLog.map((item: any) => {
        item.Groups = item.Groups?.join(",") || "";
        return item;
      });
    }

    return response.data;
  } catch (error: any) {
    return error.response;
  }
};
const UserService = {
  getUsers,
  getUser,
  updateUser,
  exportUsers,
  getUsersActivityLog,
  getUsersActivityLogExport,
};
export default UserService;
