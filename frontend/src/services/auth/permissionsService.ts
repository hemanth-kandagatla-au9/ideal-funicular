import Cookies from "universal-cookie";
import AxiosInstanceClass from "../axiosInstance";
import Config from "../../config/config";
import { getIdToken } from "../../utils/TokenService";

const AUTH_API_URL = Config.apiEndpoints.RBAC_auth.baseUrl;

const cookies = new Cookies();
let _instance: ReturnType<AxiosInstanceClass["init"]> | null = null;

export const getAxiosInstance = async () => {
  if (_instance) return _instance;
  console.log("newtoken_permission>>", await getIdToken());
  const token = (await getIdToken()) ?? cookies.get("iasphere_id_token") ?? "";
  console.log("token_permission>>", token);
  _instance = new AxiosInstanceClass(AUTH_API_URL).init(token);
  return _instance;
};

const fetchMyPermissions = async (): Promise<any> => {
  try {
    const instance = await getAxiosInstance();
    const response = await instance.get("/auth/getUserPermission");
    return response;
  } catch {
    return null;
  }
};

const permissionsService = { fetchMyPermissions };
export default permissionsService;
