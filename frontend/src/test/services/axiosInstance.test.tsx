/* eslint-disable @typescript-eslint/no-empty-function */

import axios from "axios";
import AxiosInstance from "../../services/axiosInstance";
import * as TokenService from "../../utils/TokenService";

jest.mock("axios");
jest.mock("../../utils/TokenService");

describe("AxiosInstance", () => {
  let instance: AxiosInstance;
  let mockedAxios: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    
    mockedAxios = {
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      defaults: { headers: { common: {} } },
    };
    
    (axios.create as jest.Mock).mockReturnValue(mockedAxios);
    instance = new AxiosInstance("https://test.api");
  });

  it("should initialize axios instance with correct options", () => {
    instance.init();
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "https://test.api",
        headers: { "X-Custom-Header": "erpops" },
        credentials: "include",
      })
    );
  });

  it("should attach request interceptor", () => {
    instance.init();
    expect(mockedAxios.interceptors.request.use).toHaveBeenCalled();
  });

  it("should attach response interceptor", () => {
    instance.init();
    expect(mockedAxios.interceptors.response.use).toHaveBeenCalled();
  });

  it("should return the axios instance from init", () => {
    const result = instance.init();
    expect(result).toBe(mockedAxios);
  });

  it("should add authorization header when token is available", async () => {
    (TokenService.getAccessToken as jest.Mock).mockResolvedValue("access-token");
    instance.init();
    const reqInterceptor = mockedAxios.interceptors.request.use.mock.calls[0][0];
    const config = { headers: {} };
    const result = await reqInterceptor(config);
    expect(result.headers.Authorization).toBe("Bearer access-token");
  });

  it("should not add authorization header when token is not available", async () => {
    (TokenService.getAccessToken as jest.Mock).mockResolvedValue(null);
    instance.init();
    const reqInterceptor = mockedAxios.interceptors.request.use.mock.calls[0][0];
    const config = { headers: {} };
    const result = await reqInterceptor(config);
    expect(result.headers.Authorization).toBeUndefined();
  });

  it("should return response in response interceptor success case", async () => {
    instance.init();
    const responseInterceptor = mockedAxios.interceptors.response.use.mock.calls[0][0];
    const response = { data: "ok" };
    const result = await responseInterceptor(response);
    expect(result).toBe(response);
  });

  it("should clear session and redirect on 401 error", async () => {
    instance.init();
    const responseInterceptor = mockedAxios.interceptors.response.use.mock.calls[0][1];
    const error = {
      response: { status: 401, data: {} },
    };
    
    // Mock window.location.href assignment
    delete (window as any).location;
    window.location = { href: "" } as any;
    
    await expect(responseInterceptor(error)).rejects.toBe(error);
    expect(window.location.href).toBe("/session-expired");
  });

  it("should clear session and redirect on Session Expired message", async () => {
    instance.init();
    const responseInterceptor = mockedAxios.interceptors.response.use.mock.calls[0][1];
    const error = {
      response: { status: 200, data: { message: "Session Expired" } },
    };
    
    delete (window as any).location;
    window.location = { href: "" } as any;
    
    await expect(responseInterceptor(error)).rejects.toBe(error);
    expect(window.location.href).toBe("/session-expired");
  });

  it("should reject other errors without redirecting", async () => {
    instance.init();
    const responseInterceptor = mockedAxios.interceptors.response.use.mock.calls[0][1];
    const error = {
      response: { status: 500, data: { message: "Server Error" } },
    };
    
    await expect(responseInterceptor(error)).rejects.toBe(error);
  });
});



