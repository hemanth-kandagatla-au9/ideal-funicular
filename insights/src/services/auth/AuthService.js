import Cookies from "universal-cookie";
import Config from "../../config/config";
import { getLocalAccessToken } from "../../utils/TokenUtils";
import AxiosInstanceClass from "../axiosInstance";

const { baseUrl, get, patch, post, del } = Config.apiEndpoints.auth;

export const AxiosInstance = new AxiosInstanceClass(baseUrl).init();

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

const getUserById = async (userId) => {
  try {
    const cookies = new Cookies();
    const accessToken = cookies.get("token");
    const response = await AxiosInstance.get(`${get.users}${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response?.data?.data;
  } catch (getUserByIdErr) {
    return getUserByIdErr?.response?.data;
  }
};

const logout = async (userId) => {
  try {
    const cookies = new Cookies();
    const accessToken = cookies.get("token");
    const response = await AxiosInstance.patch(`${patch.logout}/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response?.data?.data;
  } catch (logoutErr) {
    return logoutErr;
  }
};

const modifyUser = async (userId, body) => {
  try {
    const cookies = new Cookies();
    const accessToken = cookies.get("token");
    const response = await AxiosInstance.patch(
      `${patch.updateUser}/${userId}`,
      body,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response?.data?.data;
  } catch (logoutErr) {
    return logoutErr;
  }
};

const addApplication = async (applicationData) => {
  try {
    const response = await AxiosInstance.post(
      `${post.addApplication}`,
      applicationData,
      {
        headers: { Authorization: `Bearer ${getLocalAccessToken()}` },
      }
    );
    return response?.data;
  } catch (addApplicationErr) {
    return addApplicationErr?.response?.data;
  }
};

const updateApplication = async (id, applicationData) => {
  try {
    const response = await AxiosInstance.patch(
      `${patch.updateApplication}${id}`,
      applicationData,
      {
        headers: { Authorization: `Bearer ${getLocalAccessToken()}` },
      }
    );
    return response?.data;
  } catch (updateApplicationErr) {
    return updateApplicationErr?.response?.data;
  }
};

const deleteApplication = async (id) => {
  try {
    const response = await AxiosInstance.delete(
      `${del.deleteApplication}/${id}`
    );
    return response?.data;
  } catch (deleteApplicationErr) {
    return deleteApplicationErr?.response?.data;
  }
};

const blockApplication = async (id, data) => {
  try {
    const response = await AxiosInstance.patch(
      `${patch.blockApplication}/${id}`,
      data
    );
    return response?.data;
  } catch (blockApplicationErr) {
    return blockApplicationErr?.response.data;
  }
};

const listApplication = async (listParam) => {
  try {
    const { filter, pagination } = listParam;
    const { limit, pageNo } = pagination;
    const url = !filter
      ? `${get.applicationList}?limit=${limit}&pageNo=${pageNo}`
      : `${get.applicationList}?limit=${limit}&pageNo=${pageNo}&appName=${filter}`;
    const response = await AxiosInstance.get(url, {
      headers: { Authorization: `Bearer ${getLocalAccessToken()}` },
    });
    return response?.data;
  } catch (listApplicationErr) {
    return listApplicationErr?.response.data;
  }
};

const getAuthAuditLogForCSV = async (filter) => {
  try {
    const filterParams = new URLSearchParams({ ...filter }).toString();
    const response = await AxiosInstance.get(
      filterParams
        ? `${get.getAuditLogForCSV}?${filterParams}`
        : get.getAuditLogForCSV
    );
    return response?.data;
  } catch (error) {
    return error?.response;
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
  getAuthAuditLogForCSV,
};
export default AuthService;
