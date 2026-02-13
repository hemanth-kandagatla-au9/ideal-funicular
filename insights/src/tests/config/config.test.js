import config from "../../config/config";

describe("Config Tests", () => {
  test("Config has appName property", () => {
    expect(config.appName).toBeDefined();
    expect(typeof config.appName).toBe("string");
  });

  test("Config has baseURL property", () => {
    expect(config.baseURL).toBeDefined();
    expect(typeof config.baseURL).toBe("string");
  });

  test("Config has apiEndpoints property", () => {
    expect(config.apiEndpoints).toBeDefined();
    expect(typeof config.apiEndpoints).toBe("object");
  });

  test("Config has toastNotify property", () => {
    expect(config.toastNotify).toBeDefined();
    expect(config.toastNotify.default).toBeDefined();
  });

  test("Config has planning property", () => {
    expect(config.planning).toBeDefined();
    expect(typeof config.planning).toBe("object");
    expect(config.planning.devBaseUrl).toBeDefined();
    expect(typeof config.planning.devBaseUrl).toBe("string");
  });


  test("Config has API_TIMEOUT property", () => {
    expect(config.API_TIMEOUT).toBeDefined();
    expect(typeof config.API_TIMEOUT).toBe("number");
  });

  test("Config has REFRESH_PERMISSION_TIME property", () => {
    expect(config.REFRESH_PERMISSION_TIME).toBeDefined();
    expect(typeof config.REFRESH_PERMISSION_TIME).toBe("number");
  });
});