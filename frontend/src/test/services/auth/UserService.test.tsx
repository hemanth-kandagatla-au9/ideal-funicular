/* eslint-disable jest/no-identical-title */
import apiEndpoints from "../../../config/apiEndpoints";
import AuthService from "../../../services/auth/AuthService";
import UserService,{AxiosInstance} from "./../../../services/auth/UserService";
const { get, patch, baseUrl } = apiEndpoints.auth;

describe("UserService", () => {
  let mockGet = null;
  let mockPatch = null;
 
  beforeEach(() => {
    mockGet = jest.spyOn(AxiosInstance, "get");
    mockPatch = jest.spyOn(AxiosInstance, "patch");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("UserService getUsers SUCCESS", async () => {
    const response = {
      data:{
        "status": true,
        "statusCode": 200,
        "message": "Api executed successfully",
        "data": {
            "users": [{
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
    const payload={filter:{name:'mock',group:'mock-group',isLoggedIn:true},pagination:{
        limit: 10,
        pageNo: 1
    }}
    await UserService.getUsers(payload);
    expect(mockGet).toHaveBeenCalledWith(`${get.users}?limit=10&pageNo=1&name=mock&memberOf=mock-group&isLoggedIn=true`);
  });
  it("UserService getUsers SUCCESS", async () => {
    const response = {
      data:{
        "status": true,
        "statusCode": 200,
        "message": "Api executed successfully",
        "data": {
            "users": [{
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
    const payload={filter:{},pagination:{
        limit: 10,
        pageNo: 1
    }}
    await UserService.getUsers(payload);
    expect(mockGet).toHaveBeenCalledWith(`${get.users}?limit=10&pageNo=1`);
  });
  
  it("UserService getUsers FAILURE", async () => {
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
    const payload={filter:{name:'mock'},pagination:{
        limit: 10,
        pageNo: 1
    }}
    await UserService.getUsers(payload);
    expect(mockGet).toHaveBeenCalledWith(`${get.users}?limit=10&pageNo=1&name=mock`);
  });

  it("UserService getUser SUCCESS", async () => {
    const response = {
      data:{
        "status": true,
        "statusCode": 200,
        "message": "Fetched successfully",
        "data": {
            "user": {
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
    await UserService.getUser('mockuser');
    expect(mockGet).toHaveBeenCalledWith(`${get.users}mockuser`);
  });
  it("UserService getUser SUCCESS", async () => {
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
    await UserService.getUser('mockuser','mockToken');
    expect(mockGet).toHaveBeenCalled();
    const calls = mockGet.mock.calls.length;
    expect(calls).toEqual(1);
  });
  it("UserService getUser FAILURE", async () => {
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
    await UserService.getUser();
    expect(mockGet).toHaveBeenCalledWith(`${get.users}undefined`);
  });

  it("UserService updateUser SUCCESS", async () => {
    const response = {
        data:{"status":true,"statusCode":200,"message":"Updated successfully","data":{"user":{"acknowledged":true,"modifiedCount":1,"upsertedId":null,"upsertedCount":0,"matchedCount":1}}}
    }
    const mockID ='mockUserId'
    const mockData = {
      roles: [],
    };
    mockPatch.mockImplementation(() => Promise.resolve(response));
     await UserService.updateUser(mockID, mockData);
    expect(mockPatch).toHaveBeenCalled();
    const calls = mockPatch.mock.calls.length;
    expect(calls).toEqual(1);
  });
  it("UserService updateUser FAILURE", async () => {
    const response = {
      response: {
        data: "Fail",
      },
    };
    const mockID ='mockUserId'
    const mockData = {
      roles: [],
    };
    mockPatch.mockImplementation(() => Promise.reject(response));
    await UserService.updateUser(mockID, mockData);
    expect(mockPatch).toHaveBeenCalled();
    const calls = mockPatch.mock.calls.length;
    expect(calls).toEqual(1);
  });
  
  it("UserService exportUsers SUCCESS", async () => {
    const response = {
      data:{
        "status": true,
        "statusCode": 200,
        "message": "Api executed successfully",
        "data": {
            "users": [{
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
    const payload={filter:{name:'mock'}}
    await UserService.exportUsers(payload);
    expect(mockGet).toHaveBeenCalledWith(`${get.usersExport}?name=mock`);
  });
  it("UserService exportUsers FAILURE", async () => {
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
    const payload={filter:{name:'mock'}}
    await UserService.exportUsers(payload);
    expect(mockGet).toHaveBeenCalledWith(`${get.usersExport}?name=mock`);
  });

  it("UserService exportUsers SUCCESS", async () => {
    const response = {
      data:{
        "status": true,
        "statusCode": 200,
        "message": "Api executed successfully",
        "data": {
            "users": [{
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
    const payload={filter:{isLoggedIn :null}}
    await UserService.exportUsers(payload);
    expect(mockGet).toHaveBeenCalledWith(`${get.usersExport}`);
  });

  it("UserService exportUsers SUCCESS", async () => {
    const response = {
      data:{
        "status": true,
        "statusCode": 200,
        "message": "Api executed successfully",
        "data": {
            "users": [{
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
    const payload={filter:{isLoggedIn :true}}
    await UserService.exportUsers(payload);
    expect(mockGet).toHaveBeenCalledWith(`${get.usersExport}?isLoggedIn=true`);
  });

  it("UserService getUsersActivityLog SUCCESS", async () => {
    const response = {
      data:{
        "status": true,
        "statusCode": 200,
        "message": "Api executed successfully",
        "data": {
            "usersActivityLog": [ {
              "_id": "6425fd05277bfdb81b60686e",
              "sub": "702374717",
              "name": "Kapil Patwal",
              "memberOf": [
                  "JJT-APP-RISE-DB-READONLY-NONPROD"
              ],
              "locale": "NA",
              "email": "kpatwal1@its.jnj.com",
              "accessToken": "mockToken",
              "isLoggedIn": false,
              "loggedInAt": "2023-03-30T21:20:05.536Z",
              "loggedOutAt": "2023-03-30T21:20:05.536Z"
          },],
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
    const payload={filter:{},pagination:{
        limit: 10,
        pageNo: 1
    }}
    await UserService.getUsersActivityLog(payload);
    expect(mockGet).toHaveBeenCalledWith(`${get.usersActivityLog}?limit=10&pageNo=1`);
  });
  
  it("UserService getUsersActivityLog FAILURE", async () => {
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
    const payload={filter:{name:'mock'},pagination:{
        limit: 10,
        pageNo: 1
    }}
    await UserService.getUsersActivityLog(payload);
    
    expect(mockGet).toHaveBeenCalledWith(`${get.usersActivityLog}?name=mock&limit=10&pageNo=1`);
  });

  it("Auth Service getUsersActivityLogExport SUCCESS", async () => {
    const response = {
      data:{
        "status": true,
        "statusCode": 200,
        "message": "Api executed successfully",
        "data": {
            "usersActivityLog":[{
              "WWID": "702396418",
              "Name": "Varsha Ravi",
              "Email": "vravi6@its.jnj.com",
              "Groups": [
                  "JJT-APP-RISE-DEV",
                  "JJT-APP-RISE-Developer",
                  "JJT-APP-RISE-PREDEV",
                  "JJT-APP-RISE-PROD",
                  "JJT-APP-RISE-QA",
                  "JJT-APP-RISE-SUPPORT-L3"
              ],
              "Locale": "NA",
              "Last Login": "2023-05-26T18:09:58.740Z",
              "Last Logout": "2023-05-26T18:09:58.750Z",
              "Status": true,
              "Blocked": false
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
    const filter={name:'mock',actionType:'delete'}
    await UserService.getUsersActivityLogExport(filter);
    expect(mockGet).toHaveBeenCalledWith(`${get.usersActivityLog}/export?name=mock&actionType=delete`);
  });
  it("Auth Service getUsersActivityLogExport SUCCESS with Groups transformation", async () => {
    const mockResponse = {
      data: {
        status: true,
        statusCode: 200,
        message: "Api executed successfully",
        data: {
          usersActivityLog: [{
            WWID: "702396418",
            Name: "Varsha Ravi",
            Email: "vravi6@its.jnj.com",
            Groups: ["Group1", "Group2"],
            Locale: "NA",
            "Last Login": "2023-05-26T18:09:58.740Z",
            "Last Logout": "2023-05-26T18:09:58.750Z",
            Status: true,
            Blocked: false
          }]
        }
      }
    };
  
    // Mock the Axios response
    mockGet.mockImplementation(() => Promise.resolve(mockResponse));
  
    const filter = { name: 'mock' };
    const result = await UserService.getUsersActivityLogExport(filter);
  
    // Verify the response structure and transformation
    expect(result).toEqual({
      status: true,
      statusCode: 200,
      message: "Api executed successfully",
      data: {
        usersActivityLog: [{
          WWID: "702396418",
          Name: "Varsha Ravi",
          Email: "vravi6@its.jnj.com",
          Groups: "Group1,Group2", // This verifies the transformation
          Locale: "NA",
          "Last Login": "2023-05-26T18:09:58.740Z",
          "Last Logout": "2023-05-26T18:09:58.750Z",
          Status: true,
          Blocked: false
        }]
      }
    });
    
    // Verify the API was called correctly
    expect(mockGet).toHaveBeenCalledWith(`${get.usersActivityLog}/export?name=mock`);
  });

  describe('getUsersActivityLogExport', () => {
    it('should transform Groups array to comma-separated string', async () => {
      const mockResponse = {
        data: {
          data: {
            usersActivityLog: [{
              WWID: '123',
              Groups: ['Group1', 'Group2']
            }]
          }
        }
      };
      mockGet.mockResolvedValue(mockResponse);
  
      const result = await UserService.getUsersActivityLogExport({});
      
      expect(result.data.usersActivityLog[0].Groups).toBe('Group1,Group2');
      expect(mockGet).toHaveBeenCalledWith(`${get.usersActivityLog}/export`);
    });
  
    it('should handle empty Groups array', async () => {
      const mockResponse = {
        data: {
          data: {
            usersActivityLog: [{
              WWID: '123',
              Groups: []
            }]
          }
        }
      };
      mockGet.mockResolvedValue(mockResponse);
  
      const result = await UserService.getUsersActivityLogExport({});
      
      expect(result.data.usersActivityLog[0].Groups).toBe('');
    });
  
    it('should handle error case', async () => {
      const errorResponse = {
        response: {
          data: {
            data: { // This matches the double-nested structure
              status: false,
              message: 'Error occurred'
            }
          }
        }
      };
      mockGet.mockRejectedValue(errorResponse);
    
      const result = await UserService.getUsersActivityLogExport({});
      
      expect(result).toEqual({
        data: {
          data: { // Now matches the actual return structure
            status: false,
            message: 'Error occurred'
          }
        }
      });
    });
  
    it('should include filter params in URL', async () => {
      const mockResponse = {
        data: {
          data: {
            usersActivityLog: [{
              WWID: '123',
              Groups: ['Group1']
            }]
          }
        }
      };
      mockGet.mockResolvedValue(mockResponse);
  
      await UserService.getUsersActivityLogExport({ name: 'test', type: 'login' });
      
      expect(mockGet).toHaveBeenCalledWith(
        `${get.usersActivityLog}/export?name=test&type=login`
      );
    });
  });

});



