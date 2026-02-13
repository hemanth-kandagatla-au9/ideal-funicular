import Config from "../../config/config";
import AxiosInstanceClass from "../axiosInstance";
import { getLocalAccessToken } from "../../utils/TokenUtils";

const { patch, get, baseUrl } = Config.apiEndpoints.auth;
export const AxiosInstance = new AxiosInstanceClass(`${baseUrl}/`).init(
  getLocalAccessToken()
);

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response?.data?.message === "Session Expired") {
      sessionStorage.clear();
      window.location.href = "/session-expired";
    }
    return Promise.reject(error);
  }
);

const getUsers = async (payload) => {
  try {
    const { filter, pagination } = payload;
    let url =
      filter && !filter.name
        ? `${get.users}?limit=${pagination.limit}&pageNo=${pagination.pageNo}`
        : `${get.users}?limit=${pagination.limit}&pageNo=${pagination.pageNo}&name=${filter.name}`;
    if (filter.group) {
      url += `&memberOf=${filter.group}`;
    }
    if (filter?.isLoggedIn != null) {
      url += `&isLoggedIn=${filter.isLoggedIn}`;
    }
    const response = await AxiosInstance.get(`${url}`);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const getUser = async (userId, accessToken) => {
  try {
    let response;
    if (accessToken) {
      response = await AxiosInstance.get(`${get.users}${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } else {
      response = await AxiosInstance.get(`${get.users}${userId}`);
    }
    return response.data.data;
  } catch (error) {
    return error;
  }
};

const updateUser = async (id, data) => {
  try {
    const response = await AxiosInstance.patch(
      `${patch.updateUser}/${id}`,
      data
    );
    return response.data;
  } catch (updateUserErr) {
    return updateUserErr.response.data;
  }
};

const exportUsers = async (payload) => {
  try {
    const { filter } = payload;
    if (
      (filter && filter.isLoggedIn === null) ||
      (filter && filter.isLoggedIn === undefined)
    ) {
      delete filter.isLoggedIn;
    }
    if (
      (filter && filter.group === null) ||
      (filter && filter.group === undefined)
    ) {
      delete filter.group;
    }
    const filterParams = new URLSearchParams(filter).toString();
    const response = await AxiosInstance.get(
      filterParams ? `${get.usersExport}?${filterParams}` : get.usersExport
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const getUsersActivityLog = async (payload) => {
  try {
    const { filter, pagination } = payload;
    const filterParams = new URLSearchParams({
      ...filter,
      ...pagination,
    }).toString();
    const response = await AxiosInstance.get(
      filterParams
        ? `${get.usersActivityLog}?${filterParams}`
        : `${get.usersActivityLog}`
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const getUsersActivityLogExport = async (filter) => {
  try {
    const filterParams = new URLSearchParams({ ...filter }).toString();
    const response = await AxiosInstance.get(
      filterParams
        ? `${get.usersActivityLog}/export?${filterParams}`
        : `${get.usersActivityLog}/export`
    );
    response.data.data.usersActivityLog =
      response.data.data.usersActivityLog.map((item) => {
        item.Groups = item.Groups.join(",");
        return item;
      });
    return response.data;
  } catch (error) {
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
