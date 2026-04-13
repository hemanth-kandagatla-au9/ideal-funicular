/**
 * permissionsService.test.tsx
 *
 * Tests for permissionsService.fetchMyPermissions:
 *  - Returns axios response on success
 *  - Returns null on error (never throws)
 *  - GET request goes to /auth/getUserPermission
 *
 * NOTE: uses jest.doMock + jest.resetModules() + require() to avoid the
 * temporal-dead-zone problem that occurs when a module-level variable is
 * referenced inside a hoisted jest.mock() factory.
 */

// ─── tests ───────────────────────────────────────────────────────────────────

describe("permissionsService.fetchMyPermissions", () => {
  let mockGet: jest.Mock;
  let permissionsService: { fetchMyPermissions: () => Promise<any> };

  beforeEach(() => {
    jest.resetModules();
    mockGet = jest.fn();

    jest.doMock("../../services/axiosInstance", () =>
      jest.fn().mockImplementation(() => ({
        init: () => ({ get: mockGet }),
      }))
    );

    jest.doMock("../../config/config", () => ({
      apiEndpoints: {
        RBAC_auth: { baseUrl: "http://mock-auth-api" },
      },
    }));

    jest.doMock("../../utils/TokenService", () => ({
      getIdToken: jest.fn().mockResolvedValue("mock-token"),
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    permissionsService = require("../../services/auth/permissionsService").default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls GET /auth/getUserPermission", async () => {
    mockGet.mockResolvedValue({ data: { flag: "success", data: { permissions: [] } } });
    await permissionsService.fetchMyPermissions();
    expect(mockGet).toHaveBeenCalledWith("/auth/getUserPermission");
  });

  it("returns the full axios response on success", async () => {
    const mockResponse = {
      data: {
        flag: "success",
        message: "OK",
        data: {
          permissions: [
            {
              project: "agent",
              modules: [
                {
                  module: "Rise Agent",
                  hasAccess: true,
                  permissions: [
                    { label: "Rise Agent : read",  hasAccess: true },
                    { label: "Rise Agent : start", hasAccess: true },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    mockGet.mockResolvedValue(mockResponse);
    const result = await permissionsService.fetchMyPermissions();
    expect(result).toEqual(mockResponse);
  });

  it("returns null when the request throws (never throws itself)", async () => {
    mockGet.mockRejectedValue(new Error("Network error"));
    const result = await permissionsService.fetchMyPermissions();
    expect(result).toBeNull();
  });

  it("returns null on 401 error (never throws)", async () => {
    mockGet.mockRejectedValue({ response: { status: 401 } });
    const result = await permissionsService.fetchMyPermissions();
    expect(result).toBeNull();
  });

  it("returns null on 500 error (never throws)", async () => {
    mockGet.mockRejectedValue({ response: { status: 500, data: { message: "Server error" } } });
    const result = await permissionsService.fetchMyPermissions();
    expect(result).toBeNull();
  });

  it("returns response with empty permissions array gracefully", async () => {
    const emptyResponse = {
      data: { flag: "success", data: { permissions: [] } },
    };
    mockGet.mockResolvedValue(emptyResponse);
    const result = await permissionsService.fetchMyPermissions();
    expect(result).toEqual(emptyResponse);
    expect(result.data.data.permissions).toEqual([]);
  });
});
