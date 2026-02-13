import Config from "../../config/config";
import AxiosInstanceClass from "../axiosInstance";
import { getLocalAccessToken } from "../../utils/TokenUtils";

const { post, get, baseUrl } = Config.apiEndpoints.auth;
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

const addPermission = async (permissionData) => {
  try {
    const response = await AxiosInstance.post(
      `${post.addPermission}`,
      permissionData
    );
    return response.data;
  } catch (addPermissionErr) {
    return addPermissionErr?.response?.data;
  }
};

const getPermissionsByGroup = async (groupId) => {
  try {
    const response = await AxiosInstance.get(
      `${get.permissionsByGroup}/${groupId}`
    );
    return response.data;
  } catch (getPermissionsErr) {
    return getPermissionsErr?.response?.data;
  }
};

const PermissionService = {
  addPermission,
  getPermissionsByGroup,
};
export default PermissionService;
