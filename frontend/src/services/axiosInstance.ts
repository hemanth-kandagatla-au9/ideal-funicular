import axios, { AxiosInstance as AxiosInstanceType, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { getIdToken } from "@/utils/TokenService";
import Config from "../config/config";

class AxiosInstance {
  private baseURL: string;

  private instance: AxiosInstanceType;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || `${Config.baseURL}`;
    this.instance = axios.create();
  }

  init() {
    const options = {
      baseURL: this.baseURL,
      headers: { "X-Custom-Header": "erpops" },
      credentials: "include",
    };

    this.instance = axios.create(options);
    this.attachRequestInterceptor();
    this.attachResponseInterceptor();
    return this.instance;
  }

  attachRequestInterceptor() {
    this.instance.interceptors.request.use(
      async config => {
        const token = await getIdToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );
  }

  attachResponseInterceptor() {
    this.instance.interceptors.response.use(
      response => response,
      error => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        // Session expired from backend
        if (message === "Session Expired") {
          sessionStorage.clear();
          window.location.href = "/session-expired";
          return Promise.reject(error);
        }

        // 401 — token truly invalid, redirect to session expired
        // MSAL handles silent refresh via getAccessToken() cache
        // No manual refresh needed here
        if (status === 401) {
          sessionStorage.clear();
          window.location.href = "/session-expired";
          return Promise.reject(error);
        }

        return Promise.reject(error);
      },
    );
  }
}

export default AxiosInstance;
