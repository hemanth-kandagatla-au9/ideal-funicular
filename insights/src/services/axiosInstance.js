import axios from "axios";
import Config from "../config/config";
import {
  getLocalAccessToken,
  getLocalRefreshToken,
  getLocalUserId,
  updateLocalTokens,
} from "../utils/TokenUtils";

class AxiosInstance {
  constructor(baseURL) {
    this.baseURL = baseURL || `${Config.baseURL}`;
    this.instance = () => {
      return null;
    };
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        return prom instanceof Promise && typeof prom.reject === "function"
          ? prom.reject(error)
          : error;
      }
      if (prom instanceof Promise && !error) {
        return typeof prom.resolve === "function" ? prom.resolve(token) : token;
      }
      return prom?.resolve(token);
    });
    this.failedQueue = [];
    return false;
  }

  init(token) {
    const options = {
      baseURL: this.baseURL,
      // timeout: Config.API_TIMEOUT,
      headers: { "X-Custom-Header": "erpops" },
      credentials: "include",
    };
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }
    this.instance = axios.create(options);
    this.refreshToken();
    this.updateHeaderToken();
    return this.instance;
  }

  updateHeaderToken() {
    this?.instance?.interceptors?.request.use(
      (config) => {
        const localAccessToken = getLocalAccessToken();
        if (localAccessToken) {
          config.isUpdated = true;
          config.headers.Authorization = `Bearer ${localAccessToken}`;
        }
        config.isUpdated = false;
        return config;
      },
      (error) => error
    );
  }

  refreshToken(returnError = true) {
    this?.instance?.interceptors?.response.use(
      (res) => res,
      async (err) => {
        const UNAUTHORIZED_STATUS_CODE = 401;
        const originalConfig = err.config;
        if (
          originalConfig.url !== "/v1/auth/authorize" &&
          err.response &&
          err.response.status === UNAUTHORIZED_STATUS_CODE &&
          !originalConfig._retry
        ) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalConfig.headers.Authorization = `Bearer ${token}`;
                return this.instance(originalConfig);
              })
              .catch((err1) => Promise.reject(err1));
          }
          this.isRefreshing = true;
          originalConfig._retry = true;
          try {
            const localRefreshToken = getLocalRefreshToken();
            if (localRefreshToken) {
              const userId = getLocalUserId();
              if (userId) {
                const rs = await this.instance.patch(
                  `${Config.apiEndpoints.auth.baseUrl}${Config.apiEndpoints.auth.patch.refreshToken}/${userId}`,
                  {
                    refreshToken: localRefreshToken,
                  }
                );
                const { accessToken, refreshToken } = rs.data.data;
                updateLocalTokens(accessToken, refreshToken);
                if (
                  this &&
                  this.instance &&
                  this.instance.defaults &&
                  this.instance.defaults.headers &&
                  this.instance.defaults.headers.common &&
                  this.instance.defaults.headers.common.Authorization
                ) {
                  this.instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                }
                originalConfig.headers.Authorization = `Bearer ${accessToken}`;
                this.processQueue(null, accessToken);
                return originalConfig;
              }
            }
            return Promise.reject(err);
          } catch (_error) {
            return Promise.reject(_error);
          } finally {
            this.isRefreshing = false;
          }
        }
        return returnError ? Promise.reject(err) : err;
      }
    );
  }
}

export default AxiosInstance;
