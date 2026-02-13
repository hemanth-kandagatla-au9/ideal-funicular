import apiEndpoints from "../../config/apiEndpoints";
import AuditService,{AxiosInstance} from "../../services/auth/AuditService";
const { get } = apiEndpoints.auth;

describe("AuditService", () => {
  let mockGet = null;
  let mockPatch = null;
 
  beforeEach(() => {
    mockGet = jest.spyOn(AxiosInstance, "get");
    mockPatch = jest.spyOn(AxiosInstance, "patch");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("AuditService getAuthAuditLog SUCCESS 1", async () => {
    const response = {
      data:{
        "status": true,
        "statusCode": 200,
        "message": "Api executed successfully",
        "data": {
            "audits": [{
                "_id": "6425a663c6c20df6647c9f14",
                "createdBy": "kpatwal1",
                "modifiedBy": "kpatwal1",
                "prevState": {
                    "_id": "641b5fb3163694721db3040c",
                    "groupId": "63904a8ba24e4d730d80181b",
                    "__v": 0,
                    "createdAt": "2023-03-22T20:06:11.372Z",
                    "createdBy": "KPatwal1",
                    "isDeleted": false,
                    "modifiedBy": "KPatwal1",
                    "permissions": {
                        "6267f1f8dc995ea5685c25d4": true,
                        "6267f1f8dc995ea5685c25d5": true,
                        "6267f1f8dc995ea5685c25d6": true
                    },
                    "updatedAt": "2023-03-30T09:05:47.502Z"
                },
                "currentState": {
                    "_id": "641b5fb3163694721db3040c",
                    "groupId": "63904a8ba24e4d730d80181b",
                    "__v": 0,
                    "createdAt": "2023-03-22T20:06:11.372Z",
                    "createdBy": "KPatwal1",
                    "isDeleted": false,
                    "modifiedBy": "KPatwal1",
                    "permissions": {
                        "6267f1f8dc995ea5685c25d4": true,
                        "6267f1f8dc995ea5685c25d5": true,
                        "6267f1f8dc995ea5685c25d6": true,
                        "63b75bbab93b08fcc81b8e66": true
                    },
                    "updatedAt": "2023-03-30T09:05:47.502Z",
                    "$setOnInsert": {
                        "__v": 0,
                        "createdAt": "2023-03-30T15:10:27.327Z"
                    },
                    "$set": {
                        "updatedAt": "2023-03-30T15:10:27.327Z"
                    }
                },
                "actionType": "update",
                "operation": "findOneAndUpdate",
                "collectionName": "grouppermissions",
                "selector": {
                    "groupId": "63904a8ba24e4d730d80181b"
                },
                "diff": {
                    "permissions": {
                        "63b75bbab93b08fcc81b8e66": true
                    }
                },
                "updateObject": {
                    "groupId": "63904a8ba24e4d730d80181b",
                    "permissions": {
                        "6267f1f8dc995ea5685c25d4": true,
                        "6267f1f8dc995ea5685c25d5": true,
                        "6267f1f8dc995ea5685c25d6": true,
                        "63b75bbab93b08fcc81b8e66": true
                    },
                    "createdBy": "KPatwal1",
                    "modifiedBy": "KPatwal1",
                    "isDeleted": false,
                    "setOnInsert": {
                        "__v": 0
                    }
                },
                "createDate": "2023-03-22T20:06:11.372Z",
                "modifiedDate": "2023-03-30T15:10:27.327Z",
                "createdAt": "2023-03-30T15:10:27.364Z",
                "updatedAt": "2023-03-30T15:10:27.364Z",
                "__v": 0,
                "readableDiff": {
                    "permissions": {
                        "developer": true
                    }
                },
                "readableSelector": {
                    "groupId": "JJT-APP-RISE-Robot112"
                }
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
    const payload={filter:{name:'mock',actionType:'delete'},pagination:{
        limit: 10,
        pageNo: 1
    }}
    await AuditService.getAuthAuditLog(payload);
    expect(mockGet).toHaveBeenCalledWith(`${get.auditLog}?name=mock&actionType=delete&limit=10&pageNo=1`);
  });
  it("AuditService getAuthAuditLog SUCCESS 2", async () => {
    const response = {
        data:{
          "status": true,
          "statusCode": 200,
          "message": "Api executed successfully",
          "data": {
              "audits": [{
                  "_id": "6425a663c6c20df6647c9f14",
                  "createdBy": "kpatwal1",
                  "modifiedBy": "kpatwal1",
                  "prevState": {
                      "_id": "641b5fb3163694721db3040c",
                      "groupId": "63904a8ba24e4d730d80181b",
                      "__v": 0,
                      "createdAt": "2023-03-22T20:06:11.372Z",
                      "createdBy": "KPatwal1",
                      "isDeleted": false,
                      "modifiedBy": "KPatwal1",
                      "permissions": {
                          "6267f1f8dc995ea5685c25d4": true,
                          "6267f1f8dc995ea5685c25d5": true,
                          "6267f1f8dc995ea5685c25d6": true
                      },
                      "updatedAt": "2023-03-30T09:05:47.502Z"
                  },
                  "currentState": {
                      "_id": "641b5fb3163694721db3040c",
                      "groupId": "63904a8ba24e4d730d80181b",
                      "__v": 0,
                      "createdAt": "2023-03-22T20:06:11.372Z",
                      "createdBy": "KPatwal1",
                      "isDeleted": false,
                      "modifiedBy": "KPatwal1",
                      "permissions": {
                          "6267f1f8dc995ea5685c25d4": true,
                          "6267f1f8dc995ea5685c25d5": true,
                          "6267f1f8dc995ea5685c25d6": true,
                          "63b75bbab93b08fcc81b8e66": true
                      },
                      "updatedAt": "2023-03-30T09:05:47.502Z",
                      "$setOnInsert": {
                          "__v": 0,
                          "createdAt": "2023-03-30T15:10:27.327Z"
                      },
                      "$set": {
                          "updatedAt": "2023-03-30T15:10:27.327Z"
                      }
                  },
                  "actionType": "update",
                  "operation": "findOneAndUpdate",
                  "collectionName": "grouppermissions",
                  "selector": {
                      "groupId": "63904a8ba24e4d730d80181b"
                  },
                  "diff": {
                      "permissions": {
                          "63b75bbab93b08fcc81b8e66": true
                      }
                  },
                  "updateObject": {
                      "groupId": "63904a8ba24e4d730d80181b",
                      "permissions": {
                          "6267f1f8dc995ea5685c25d4": true,
                          "6267f1f8dc995ea5685c25d5": true,
                          "6267f1f8dc995ea5685c25d6": true,
                          "63b75bbab93b08fcc81b8e66": true
                      },
                      "createdBy": "KPatwal1",
                      "modifiedBy": "KPatwal1",
                      "isDeleted": false,
                      "setOnInsert": {
                          "__v": 0
                      }
                  },
                  "createDate": "2023-03-22T20:06:11.372Z",
                  "modifiedDate": "2023-03-30T15:10:27.327Z",
                  "createdAt": "2023-03-30T15:10:27.364Z",
                  "updatedAt": "2023-03-30T15:10:27.364Z",
                  "__v": 0,
                  "readableDiff": {
                      "permissions": {
                          "developer": true
                      }
                  },
                  "readableSelector": {
                      "groupId": "JJT-APP-RISE-Robot112"
                  }
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
    await AuditService.getAuthAuditLog(payload);
    expect(mockGet).toHaveBeenCalledWith(`${get.auditLog}?limit=10&pageNo=1`);
  });
  
  it("AuditService getAuthAuditLog FAILURE", async () => {
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
    await AuditService.getAuthAuditLog(payload);
    expect(mockGet).toHaveBeenCalledWith(`${get.auditLog}?name=mock&limit=10&pageNo=1`);
  });

});
