/**
 * Component dependencies.
 */
import axios, { AxiosInstance as AxiosInstanceType, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import Config from "../config/config";
import { getLocalAccessToken, getLocalRefreshToken, getLocalUserId, updateLocalTokens } from "../utils/TokenUtils";

type FailedQueueItem = {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
};

/**
 * Helper class for handling Axios api instance & calls.
 */
class AxiosInstance {
  private baseURL: string;

  private instance: AxiosInstanceType;

  private isRefreshing: boolean;

  private failedQueue: FailedQueueItem[];

  constructor(baseURL?: string) {
    this.baseURL = baseURL || `${Config.baseURL}`;
    this.instance = axios.create();
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  private processQueue(error: AxiosError | null, token: string | null = null): boolean {
    this.failedQueue.forEach(prom => {
      if (error) {
        // Handle error case
        if (prom instanceof Promise && typeof prom.reject === "function") {
          prom.reject(error);
        }
        return error;
      }

      // Handle success case
      if (prom instanceof Promise && !error) {
        if (typeof prom.resolve === "function") {
          prom.resolve(token);
        }
        return token;
      }
      if (prom?.resolve) {
        prom.resolve(token);
      }
      return prom?.resolve(token);
    });

    this.failedQueue = [];
    return false;
  }

  /**
   * Method for creating axios instance.
   */
  public init(token?: string): AxiosInstanceType {
    const options: AxiosRequestConfig = {
      baseURL: this.baseURL,
      timeout: Config.API_TIMEOUT,
      headers: { "X-Custom-Header": "erpops" },
      credentials: "include",
    };

    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    if (this.baseURL.includes(".provisioning.")) {
      options.withCredentials = true;
    }

    this.instance = axios.create(options);
    this.refreshToken();
    this.updateHeaderToken();
    return this.instance;
  }

  /**
   * Method for sending token in headers of every api call.
   */
  private updateHeaderToken(): void {
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const localAccessToken = getLocalAccessToken();
        if (localAccessToken) {
          config.isUpdated = true;
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${localAccessToken}`,
          };
        }
        config.isUpdated = false;
        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );
  }

  /**
   * Method for refreshing accessToken once expired.
   */
  private refreshToken(returnError = true): void {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (err: AxiosError) => {
        const UNAUTHORIZED_STATUS_CODE = 401;
        const originalConfig = err.config as AxiosRequestConfig & { _retry?: boolean };

        if (originalConfig.url !== "/v1/auth/authorize" && err.response && err.response.status === UNAUTHORIZED_STATUS_CODE && !originalConfig._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token: string) => {
                originalConfig.headers = {
                  ...originalConfig.headers,
                  Authorization: `Bearer ${token}`,
                };
                return this.instance(originalConfig);
              })
              .catch(err1 => Promise.reject(err1));
          }

          this.isRefreshing = true;
          originalConfig._retry = true;

          try {
            const localRefreshToken = getLocalRefreshToken();
            if (localRefreshToken) {
              // helper function called to fetch userId
              const userId = getLocalUserId();
              if (userId) {
                // Below api will generate new access token & refresh token
                const rs = await this.instance.patch(`${Config.apiEndpoints.auth.baseUrl}${Config.apiEndpoints.auth.patch.refreshToken}/${userId}`, {
                  refreshToken: localRefreshToken,
                });
                const { accessToken, refreshToken } = rs.data.data;
                // helper function for updating user session
                updateLocalTokens(accessToken, refreshToken);

                if (this && this.instance && this.instance.defaults && this.instance.defaults.headers && this.instance.defaults.headers.common) {
                  this.instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                }

                originalConfig.headers = {
                  ...originalConfig.headers,
                  Authorization: `Bearer ${accessToken}`,
                };
                this.processQueue(null, accessToken);
                return this.instance(originalConfig);
              }
            }
            return Promise.reject(err);
          } catch (_error) {
            this.processQueue(_error as AxiosError);
            return Promise.reject(_error);
          } finally {
            this.isRefreshing = false;
          }
        }
        return returnError ? Promise.reject(err) : err;
      },
    );
  }
}

export default AxiosInstance;