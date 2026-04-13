/* eslint-disable jest/no-conditional-expect */
/* eslint-disable jest/no-identical-title */
import apiEndpoints from "../../../config/apiEndpoints";
import AuthService from "../../../services/auth/AuthService";
const { get, baseUrl } = apiEndpoints.auth; 

// Create mock functions
const mockGet = jest.fn();
const mockPatch = jest.fn();
const mockPost = jest.fn();
const mockDelete = jest.fn();

// Mock the axios instance
jest.mock("../../../services/axiosInstance", () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn().mockReturnValue({
      get: mockGet,
      patch: mockPatch,
      post: mockPost,
      delete: mockDelete,
    }),
  }));
});

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("AuthService getUserById SUCCESS", async () => {
    const response = {
      data:{
        "status": true,
        "statusCode": 200,
        "message": "Fetched successfully",
        "data": {
            "user":{
                "_id": "mock-id",
                "email": "mock-email",
                "__v": 0,
                "accessToken": "mock-token",
                "address": {
                    "streetAddress": "mock-address",
                    "country": "IN",
                    "region": "NA",
                    "postalCode": "mock-code"
                },
                "createdAt": "2022-05-02T13:37:20.454Z",
                "familyName": "mock",
                "givenName": "mock",
                "locale": "NA",
                "memberOf": ["mock"],
                "name": "mock name",
                "phoneNumber": "mock-number",
                "profile": "mock-profile",
                "refreshToken": "mock-refresh-token",
                "sub": "mock-sub",
                "updatedAt": "2022-07-14T21:07:24.243Z",
                "roles": ["mock-roles"]
            },
            "permissions": {}
        }
    }
    };
    mockGet.mockImplementation(() => Promise.resolve(response));
    await AuthService.getUserById('mockUserId');
    expect(mockGet).toHaveBeenCalled();
    const calls = mockGet.mock.calls.length;
    expect(calls).toEqual(1);
  });
  it("AuthService getUserById FAILURE", async () => {
    const response = {
      response: {
        data: {
            "status": false,
            "statusCode": 401,
            "message": "unauthorized",
        }
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    await AuthService.getUserById('mockUserId');
    expect(mockGet).toHaveBeenCalled();
    const calls = mockGet.mock.calls.length;
    expect(calls).toEqual(1);
  });

  it("AuthService logout SUCCESS", async () => {
    const response = {
      data:{
        "status": true,
        "statusCode": 200,
        "message": "Fetched successfully",
        "data": {
            "user":{
                "_id": "mock-id",
                "email": "mock-email",
                "__v": 0,
                "accessToken": "mock-token",
                "address": {
                    "streetAddress": "mock-address",
                    "country": "IN",
                    "region": "NA",
                    "postalCode": "mock-code"
                },
                "createdAt": "2022-05-02T13:37:20.454Z",
                "familyName": "mock",
                "givenName": "mock",
                "locale": "NA",
                "memberOf": ["mock"],
                "name": "mock name",
                "phoneNumber": "mock-number",
                "profile": "mock-profile",
                "refreshToken": "mock-refresh-token",
                "sub": "mock-sub",
                "updatedAt": "2022-07-14T21:07:24.243Z",
                "roles": ["mock-roles"]
            },
            "permissions": {}
        }
    }
    };
    mockPatch.mockImplementation(() => Promise.resolve(response));
    await AuthService.logout('mockUserId');
    expect(mockPatch).toHaveBeenCalled();
    const calls = mockPatch.mock.calls.length;
    expect(calls).toEqual(1);
  });
  it("AuthService logout FAILURE", async () => {
    const response = {
      response: {
        data: {
            "status": false,
            "statusCode": 401,
            "message": "unauthorized",
        }
      },
    };
    mockPatch.mockImplementation(() => Promise.reject(response));
    await AuthService.logout('mockUserId');
    expect(mockPatch).toHaveBeenCalled();
    const calls = mockPatch.mock.calls.length;
    expect(calls).toEqual(1);
  });

  it("AuthService modifyUser SUCCESS", async () => {
    const response = {
      data:{
        "status": true,
        "statusCode": 200,
        "message": "Fetched successfully",
        "data": {
            "user":{
                "_id": "mock-id",
                "email": "mock-email",
                "__v": 0,
                "accessToken": "mock-token",
                "address": {
                    "streetAddress": "mock-address",
                    "country": "IN",
                    "region": "NA",
                    "postalCode": "mock-code"
                },
                "createdAt": "2022-05-02T13:37:20.454Z",
                "familyName": "mock",
                "givenName": "mock",
                "locale": "NA",
                "memberOf": ["mock"],
                "name": "mock name",
                "phoneNumber": "mock-number",
                "profile": "mock-profile",
                "refreshToken": "mock-refresh-token",
                "sub": "mock-sub",
                "updatedAt": "2022-07-14T21:07:24.243Z",
                "roles": ["mock-roles"]
            },
            "permissions": {}
        }
    }
    };
    mockPatch.mockImplementation(() => Promise.resolve(response));
    await AuthService.modifyUser('mockUserId');
    expect(mockPatch).toHaveBeenCalled();
    const calls = mockPatch.mock.calls.length;
    expect(calls).toEqual(1);
  });
  it("AuthService modifyUser FAILURE", async () => {
    const response = {
      response: {
        data: {
            "status": false,
            "statusCode": 401,
            "message": "unauthorized",
        }
      },
    };
    mockPatch.mockImplementation(() => Promise.reject(response));
    await AuthService.modifyUser('mockUserId');
    expect(mockPatch).toHaveBeenCalled();
    const calls = mockPatch.mock.calls.length;
    expect(calls).toEqual(1);
  });

 
  describe("Auth Service Additional Tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("AuthService addApplication SUCCESS", async () => {
      const response = {
        data: {
          status: true,
          statusCode: 200,
          message: "Application added successfully",
          data: { id: "mock-app-id" }
        }
      };
      mockPost.mockImplementation(() => Promise.resolve(response));
      const appData = { name: "Test App", description: "Test Description" };
      await AuthService.addApplication(appData);
      expect(mockPost).toHaveBeenCalledWith(
        expect.any(String),
        appData,
        expect.objectContaining({
          headers: { Authorization: expect.any(String) }
        })
      );
    });
  
    it("AuthService addApplication FAILURE", async () => {
      const errorResponse = {
        response: {
          data: {
            status: false,
            statusCode: 400,
            message: "Invalid application data"
          }
        }
      };
      mockPost.mockImplementation(() => Promise.reject(errorResponse));
      const appData = { name: "" }; // invalid data
      const result = await AuthService.addApplication(appData);
      expect(result).toEqual(errorResponse.response.data);
    });
    it("AuthService updateApplication SUCCESS", async () => {
      const response = {
        data: {
          status: true,
          statusCode: 200,
          message: "Application updated successfully"
        }
      };
      mockPatch.mockImplementation(() => Promise.resolve(response));
      const appData = { name: "Updated App" };
      await AuthService.updateApplication("mock-id", appData);
      expect(mockPatch).toHaveBeenCalledWith(
        expect.stringContaining("mock-id"),
        appData,
        expect.objectContaining({
          headers: { Authorization: expect.any(String) }
        })
      );
    });
  
    it("AuthService updateApplication FAILURE", async () => {
      const errorResponse = {
        response: {
          data: {
            status: false,
            statusCode: 404,
            message: "Application not found"
          }
        }
      };
      mockPatch.mockImplementation(() => Promise.reject(errorResponse));
      const result = await AuthService.updateApplication("invalid-id", {});
      expect(result).toEqual(errorResponse.response.data);
    });
  
    it("AuthService deleteApplication FAILURE", async () => {
      const errorResponse = {
        response: {
          data: {
            status: false,
            statusCode: 404,
            message: "Application not found"
          }
        }
      };
      mockDelete.mockImplementation(() => Promise.reject(errorResponse));
      const result = await AuthService.deleteApplication("invalid-id");
      expect(result).toEqual(errorResponse.response.data);
    });
    it("AuthService listApplication with filter SUCCESS", async () => {
      const response = {
        data: {
          status: true,
          data: { applications: [], pagination: {} }
        }
      };
      mockGet.mockImplementation(() => Promise.resolve(response));
      const params = {
        filter: "test",
        pagination: { limit: 10, pageNo: 1 }
      };
      await AuthService.listApplication(params);
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining("appName=test"),
        expect.any(Object)
      );
    });
  
    it("AuthService listApplication without filter SUCCESS", async () => {
      const response = {
        data: {
          status: true,
          data: { applications: [], pagination: {} }
        }
      };
      mockGet.mockImplementation(() => Promise.resolve(response));
      const params = {
        pagination: { limit: 10, pageNo: 1 }
      };
      await AuthService.listApplication(params);
      expect(mockGet).toHaveBeenCalledWith(
        expect.not.stringContaining("appName="),
        expect.any(Object)
      );
    });
    it("AuthService getAuthAuditLogForCSV FAILURE", async () => {
      const errorResponse = {
        response: {
          status: 500,
          data: { message: "Server error" }
        }
      };
      mockGet.mockImplementation(() => Promise.reject(errorResponse));
      try {
        await AuthService.getAuthAuditLogForCSV({});
      } catch (error) {
        expect(error).toEqual(errorResponse.response);
      }
    });
    
    it("Auth Service getAuthAuditLogForCSV SUCCESS", async () => {
      const response = {
        data: {
          "status": true,
          "statusCode": 200,
          "message": "Api executed successfully",
          "data": {
            "audits": [{
              "_id": "6425a663c6c20df6647c9f14",
            }],
            "pagination": {
              "totalRows": 15,
              "limit": "10",
              "pageNo": "1",
              "totalPage": 2
            }
          }
        }
      };
      mockGet.mockImplementation(() => Promise.resolve(response));
      const filter = {name: 'mock', actionType: 'delete'};
      await AuthService.getAuthAuditLogForCSV(filter);
      expect(mockGet).toHaveBeenCalledWith(
        `${get.getAuditLogForCSV}?name=mock&actionType=delete`,
        expect.objectContaining({ headers: expect.any(Object) })
      );
    });
    
    it("AuthService deleteApplication SUCCESS", async () => {
      const response = {
        data: {
          status: true,
          statusCode: 200,
          message: "Application deleted successfully"
        }
      };
      mockDelete.mockImplementation(() => Promise.resolve(response));
      await AuthService.deleteApplication("mock-id");
      expect(mockDelete).toHaveBeenCalledWith(
        expect.stringContaining("mock-id"),
        expect.objectContaining({ headers: expect.any(Object) })
      );
    });
    
    it("AuthService blockApplication SUCCESS", async () => {
      const response = {
        data: {
          status: true,
          statusCode: 200,
          message: "Application blocked successfully"
        }
      };
      mockPatch.mockImplementation(() => Promise.resolve(response));
      const blockData = { isBlocked: true };
      await AuthService.blockApplication("mock-id", blockData);
      expect(mockPatch).toHaveBeenCalledWith(
        expect.stringContaining("mock-id"),
        blockData,
        expect.objectContaining({ headers: expect.any(Object) })
      );
    });
    it("AuthService blockApplication FAILURE", async () => {
      const errorResponse = {
        response: {
          data: {
            status: false,
            statusCode: 404,
            message: "Application not found"
          }
        }
      };
      mockPatch.mockImplementation(() => Promise.reject(errorResponse));
      const result = await AuthService.blockApplication("invalid-id", {});
      expect(result).toEqual(errorResponse.response.data);
    });
    
  });
});





