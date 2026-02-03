/* eslint-disable @typescript-eslint/no-empty-function */

import axios from "axios";
import AxiosInstance from "../../services/axiosInstance";
import * as TokenUtils from "../../utils/TokenUtils";

jest.mock("axios");
jest.mock("../../utils/TokenUtils");

const mockedAxios = {
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
  patch: jest.fn(),
  defaults: { headers: { common: {} } },
} as any;

(axios.create as jest.Mock).mockReturnValue(mockedAxios);

describe("AxiosInstance", () => {
  let instance: AxiosInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    instance = new AxiosInstance("http://test.api");
  });

  it("should initialize axios instance with token", () => {
    const token = "test-token";
    const spyRefresh = jest.spyOn<any, any>(instance, "refreshToken");
    const spyUpdate = jest.spyOn<any, any>(instance, "updateHeaderToken");
    const result = instance.init(token);
    expect(result).toBe(mockedAxios);
    expect(spyRefresh).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalled();
  });

  it("should process queue with token", () => {
    const resolve = jest.fn();
    const reject = jest.fn();
    (instance as any).failedQueue = [{ resolve, reject }];
    (instance as any).processQueue(null, "token");
    expect(resolve).toHaveBeenCalledWith("token");
  });

  it("should update header token in request interceptor", async () => {
    const config = { headers: {}, isUpdated: false };
    (TokenUtils.getLocalAccessToken as jest.Mock).mockReturnValue("access-token");
    instance.init();
    const reqInterceptor = mockedAxios.interceptors.request.use.mock.calls[0][0];
    const result = await reqInterceptor(config);
    expect(result.headers.Authorization).toBe("Bearer access-token");
  });

  it("should handle 401 and queue requests", async () => {
    const error = {
      config: { url: "/not-auth", headers: {}, _retry: false },
      response: { status: 401 },
    };
    (TokenUtils.getLocalRefreshToken as jest.Mock).mockReturnValue(null);
    instance.init();
    const responseInterceptor = mockedAxios.interceptors.response.use.mock.calls[0][1];
    await expect(responseInterceptor(error)).rejects.toBe(error);
  });

  it("should reject error if not 401", async () => {
    const error = {
      config: { url: "/not-auth", headers: {}, _retry: false },
      response: { status: 500 },
    };
    instance.init();
    const responseInterceptor = mockedAxios.interceptors.response.use.mock.calls[0][1];
    await expect(responseInterceptor(error)).rejects.toBe(error);
  });
  it("should process queue with error", () => {
    const error = new Error("test error");

    class FakePromise extends Promise<any> {
      reject = jest.fn();

      resolve = jest.fn();
    }

    const fake = new FakePromise(() => {});
    (instance as any).failedQueue = [fake];
    (instance as any).processQueue(error, null);

    expect(fake.reject).toHaveBeenCalledWith(error);
  });

  it("should handle 401 and refresh token", async () => {
    const error = {
      config: { url: "/not-auth", headers: {}, _retry: false },
      response: { status: 401 },
    };

    (TokenUtils.getLocalRefreshToken as jest.Mock).mockReturnValue("refresh-token");
    (TokenUtils.getLocalUserId as jest.Mock).mockReturnValue("user-id");

    mockedAxios.patch.mockResolvedValue({
      data: { data: { accessToken: "new-access", refreshToken: "new-refresh" } },
    });
    const mockInstance = jest.fn().mockResolvedValue("retried");
    Object.assign(mockInstance, mockedAxios); // copy interceptors, patch, defaults, etc.

    (axios.create as jest.Mock).mockReturnValue(mockInstance);

    instance = new AxiosInstance("http://test.api");
    instance.init();

    const responseInterceptor = mockInstance.interceptors.response.use.mock.calls[0][1];
    const result = await responseInterceptor(error);

    expect(TokenUtils.updateLocalTokens).toHaveBeenCalledWith("new-access", "new-refresh");
    expect(mockInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer new-access",
        }),
      }),
    );
    expect(result).toBe("retried");
  });

  it("should process queue with token using plain object", () => {
    const resolve = jest.fn();
    const prom = { resolve };
    (instance as any).failedQueue = [prom];
    (instance as any).processQueue(null, "token");
    expect(resolve).toHaveBeenCalledWith("token");
  });

  it("should return config unchanged if no token is found", async () => {
    (TokenUtils.getLocalAccessToken as jest.Mock).mockReturnValue(null);
    instance.init();
    const reqInterceptor = mockedAxios.interceptors.request.use.mock.calls[0][0];
    const config = { headers: {}, isUpdated: false };
    const result = await reqInterceptor(config);
    expect(result).toEqual(config);
  });

  it("should return response directly in response interceptor", async () => {
    instance.init();
    const responseInterceptor = mockedAxios.interceptors.response.use.mock.calls[0][0];
    const response = { data: "ok" };
    const result = await responseInterceptor(response);
    expect(result).toBe(response);
  });

  it("should set default Authorization header after token refresh", async () => {
    const error = {
      config: { url: "/not-auth", headers: {}, _retry: false },
      response: { status: 401 },
    };

    (TokenUtils.getLocalRefreshToken as jest.Mock).mockReturnValue("refresh-token");
    (TokenUtils.getLocalUserId as jest.Mock).mockReturnValue("user-id");

    mockedAxios.patch.mockResolvedValue({
      data: { data: { accessToken: "new-access", refreshToken: "new-refresh" } },
    });

    const mockInstance = jest.fn().mockResolvedValue("retried");
    Object.assign(mockInstance, mockedAxios);
    (axios.create as jest.Mock).mockReturnValue(mockInstance);

    instance = new AxiosInstance();
    instance.init();

    const responseInterceptor = mockInstance.interceptors.response.use.mock.calls[0][1];
    await responseInterceptor(error);

    expect(mockInstance.defaults.headers.common.Authorization).toBe("Bearer new-access");
  });
});
