import Config from "../../config/config";
import AxiosInstanceClass from "../axiosInstance";
import { getLocalAccessToken } from "../../utils/TokenUtils";

const { post, get, del, patch, baseUrl } = Config.apiEndpoints.auth;
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

const getGroups = async (groupParam) => {
  try {
    const { filter, pagination } = groupParam;
    const { limit, pageNo } = pagination;
    const url = !filter
      ? `${get.groupList}?limit=${limit}&pageNo=${pageNo}`
      : `${get.groupList}?limit=${limit}&pageNo=${pageNo}&task=${filter}`;

    const response = await AxiosInstance.get(`${url}`);
    if (!response.data.status) {
      return {
        status: false,
        message: "No Data Available",
      };
    }
    return response.data;
  } catch (getGroupErr) {
    return getGroupErr?.response?.data;
  }
};

const addGroup = async (groupData) => {
  try {
    const response = await AxiosInstance.post(`${post.addGroup}`, groupData);
    return response.data;
  } catch (addGroupErr) {
    return addGroupErr.response.data;
  }
};

const deleteGroup = async (id) => {
  try {
    const response = await AxiosInstance.delete(`${del.deleteGroup}/${id}`);
    return response.data;
  } catch (deleteGroupErr) {
    return deleteGroupErr?.response?.data;
  }
};

const updateGroup = async (id, data) => {
  try {
    const response = await AxiosInstance.patch(
      `${patch.updateGroup}/${id}`,
      data
    );
    return response.data;
  } catch (updateGroupErr) {
    return updateGroupErr.response.data;
  }
};

const exportGroups = async (groupParam) => {
  try {
    const { filter } = groupParam;
    const url = !filter
      ? `${get.groupExport}?`
      : `${get.groupExport}?&task=${filter}`;
    const groupPermissions = await AxiosInstance.get(`${url}`);
    return groupPermissions.data;
  } catch (groupPermissionErr) {
    return groupPermissionErr?.response?.data;
  }
};

const GroupService = {
  getGroups,
  addGroup,
  deleteGroup,
  updateGroup,
  exportGroups,
};
export default GroupService;
