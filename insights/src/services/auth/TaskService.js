import Cookies from "universal-cookie";
import Config from "../../config/config";
import AxiosInstanceClass from "../axiosInstance";
import { getLocalAccessToken } from "../../utils/TokenUtils";

const { post, get, baseUrl, del, patch } = Config.apiEndpoints.auth;
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

const getTasks = async (taskParam) => {
  try {
    const { filter, pagination } = taskParam;
    const filterParams = new URLSearchParams({ ...filter, ...pagination });
    const url = !filterParams
      ? `${get.taskList}`
      : `${get.taskList}?${filterParams}`;
    const response = await AxiosInstance.get(`${url}`);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const getTasksByCategory = async () => {
  try {
    const response = await AxiosInstance.get(`${get.taskListByCategory}`);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const getTaskListBySubCategory = async () => {
  try {
    const response = await AxiosInstance.get(`${get.taskListBySubCategory}`);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

const addTask = async (taskData) => {
  try {
    const response = await AxiosInstance.post(`${post.addTask}`, taskData);
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};
const deleteTask = async (id) => {
  try {
    const response = await AxiosInstance.delete(`${del.deleteTask}/${id}`);
    return response.data;
  } catch (deleteTaskError) {
    return deleteTaskError.response.data;
  }
};

const updateTask = async (id, data) => {
  try {
    const response = await AxiosInstance.patch(
      `${patch.updateTask}/${id}`,
      data
    );
    return response.data;
  } catch (updateTaskErr) {
    return updateTaskErr.response.data;
  }
};
const getSubCategory = async () => {
  try {
    const cookies = new Cookies();
    const accessToken = cookies.get("token");
    const Data = await AxiosInstance.get(`${get.getSubCategory}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const tempArray =
      Data && Data.data && Data.data.data && Data.data.data.subCategories
        ? Data.data.data.subCategories
        : [];
    const subCategoryArr = tempArray.map(({ subCategory: value, ...rest }) => ({
      key: rest._id,
      value,
      ...rest,
    }));
    return subCategoryArr;
  } catch (logoutErr) {
    return logoutErr;
  }
};

const TaskService = {
  getTasks,
  addTask,
  getTasksByCategory,
  getTaskListBySubCategory,
  updateTask,
  deleteTask,
  getSubCategory,
};
export default TaskService;
