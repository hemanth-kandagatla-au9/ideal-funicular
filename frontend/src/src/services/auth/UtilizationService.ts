import Config from "../../config/config";
import AxiosInstanceClass from "../axiosInstance";
import { getLocalAccessToken, getUserInfo } from "../../utils/TokenUtils";

interface UtilizationMetricsPayload {
  userID?: string;
  [key: string]: any;
}

interface GetUtilizationMetricDataPayload {
  exportData?: boolean;
  limit?: number;
  search?: string;
  createData?: string;
  action?: string;
  users?: string;
  sids?: string;
  regions?: string;
  platforms?: string;
  sectors?: string;
  pageNo?: number;
}
const { baseUrl } = Config.apiEndpoints.utilities;
export const AxiosInstance = new AxiosInstanceClass(`${baseUrl}/`).init(getLocalAccessToken());
const utilizationMetrics = async (type: string, payload: UtilizationMetricsPayload): Promise<string | any> => {
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;

    const formattedToday = `${dd}-${mm}-${yyyy}`;
    payload.userID = payload.userID ? payload.userID?.split("@")[0] : getUserInfo()?.email?.split("@")[0];
    await AxiosInstance.post(`${baseUrl}/v1/utilities/activity-log/`, {
      activityType: type,
      meta: payload,
      createDate: formattedToday,
    });
    return "metric added";
  } catch (error: any) {
    return error.response;
  }
};
const getUtilizationMetrics = async (): Promise<any> => {
  try {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const res = await AxiosInstance.get(`${baseUrl}/v1/utilities/activity-log/metrices`);
    return res;
  } catch (error: any) {
    return error.response;
  }
};
const getUtilizationMetricDetail = async (activity: string): Promise<any> => {
  try {
    const res = await AxiosInstance.get(`${baseUrl}/v1/utilities/activity-log/metricedata?activity=${activity}`);
    return res;
  } catch (error: any) {
    return error.response;
  }
};
const getUtilizationMetricData = async (payload: GetUtilizationMetricDataPayload): Promise<any> => {
  try {
    const url = payload.exportData
      ? `${baseUrl}/v1/utilities/activity-log?exportData=true`
      : `${baseUrl}/v1/utilities/activity-log?limit=${payload.limit}&activityType=${payload.search}&createDate=${payload.createData}&action=${payload.action}&userID=${payload.users}&sid=${payload.sids}&region=${payload.regions}&platform=${payload.platforms}&sector=${payload.sectors}&pageNo=${payload.pageNo}`;
    const res = await AxiosInstance.get(url);
    return res;
  } catch (error: any) {
    return error.response;
  }
};

const getMetricsData = async (): Promise<any> => AxiosInstance.get(`${Config.apiEndpoints.utilities.baseUrl}${Config.apiEndpoints.utilities.get.getMetricsData}`);

const getDownloadMetricsData = async (): Promise<any> => AxiosInstance.get(`${Config.apiEndpoints.utilities.baseUrl}${Config.apiEndpoints.utilities.get.getDownloadMetricsData}`);
const UtilizationService = {
  utilizationMetrics,
  getUtilizationMetrics,
  getUtilizationMetricData,
  getUtilizationMetricDetail,
  getMetricsData,
  getDownloadMetricsData,
};
export default UtilizationService;
