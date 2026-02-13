import Config from "../../config/config";
import AxiosInstanceClass from "../axiosInstance";
import { getLocalAccessToken, getUserInfo } from "../../utils/TokenUtils";

const { baseUrl } = Config.apiEndpoints.utilities;
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

const utilizationMetrics = async (type, payload) => {
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;

    const formattedToday = `${dd}-${mm}-${yyyy}`;
    payload.userID = payload.userID
      ? payload.userID?.split("@")[0]
      : getUserInfo()?.email?.split("@")[0];
    await AxiosInstance.post(`${baseUrl}/v1/utilities/activity-log/`, {
      activityType: type,
      meta: payload,
      createDate: formattedToday,
    });
    return "metric added";
  } catch (error) {
    return error.response;
  }
};

const getUtilizationMetrics = async (type, payload) => {
  try {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const res = await AxiosInstance.get(
      `${baseUrl}/v1/utilities/activity-log/metrices`
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

const getUtilizationMetricDetail = async (activity) => {
  try {
    const res = await AxiosInstance.get(
      `${baseUrl}/v1/utilities/activity-log/metricedata?activity=${activity}`
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

const getUtilizationMetricData = async (payload) => {
  try {
    const url = payload.exportData
      ? `${baseUrl}/v1/utilities/activity-log?exportData=true`
      : `${baseUrl}/v1/utilities/activity-log?limit=${payload.limit}&activityType=${payload.search}&createDate=${payload.createData}&action=${payload.action}&userID=${payload.users}&sid=${payload.sids}&region=${payload.regions}&platform=${payload.platforms}&sector=${payload.sectors}&pageNo=${payload.pageNo}`;
    const res = await AxiosInstance.get(url);
    return res;
  } catch (error) {
    return error.response;
  }
};

const getMetricsData = async () =>
  AxiosInstance.get(
    `${Config.apiEndpoints.utilities.baseUrl}${Config.apiEndpoints.utilities.get.getMetricsData}`
  );

const getDownloadMetricsData = async () =>
  AxiosInstance.get(
    `${Config.apiEndpoints.utilities.baseUrl}${Config.apiEndpoints.utilities.get.getDownloadMetricsData}`
  );

const UtilizationService = {
  utilizationMetrics,
  getUtilizationMetrics,
  getUtilizationMetricData,
  getUtilizationMetricDetail,
  getMetricsData,
  getDownloadMetricsData,
};

export default UtilizationService;
