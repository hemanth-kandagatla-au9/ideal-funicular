import Config from "../../config/config";
import { getLocalAccessToken } from "../../utils/TokenUtils";
import AxiosInstanceClass from "../axiosInstance";
const { get, baseUrl } = Config.apiEndpoints.auth;
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

const getAuthAuditLog = async (payload) => {
  try {
    const { filter, pagination } = payload;
    const filterParams = new URLSearchParams({
      ...filter,
      ...pagination,
    }).toString();
    const response = await AxiosInstance.get(
      filterParams ? `${get.auditLog}?${filterParams}` : get.auditLog
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const getUsernamesList = async (data) => {
  try {
    return await AxiosInstance.get(`${get.getUsernamesList}`);
  } catch (error) {
    return error.response;
  }
};

const Auditservice = {
  getAuthAuditLog,
  getUsernamesList,
};
export default Auditservice;
