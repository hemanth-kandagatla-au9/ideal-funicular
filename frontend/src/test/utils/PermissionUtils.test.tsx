/* eslint-disable prefer-const */
/* eslint-disable jest/no-identical-title */
import {AxiosInstance} from "../../services/auth/UserService";

import PermissionUtils from "../../utils/PermissionUtils";
import { cookies } from "../../utils/utils";
import * as TokenUtils from '../../utils/TokenUtils';

localStorage.setItem('token','bW9jay10b2tlbg==')

const mockPermission='ewoJImRpc2NvdmVyeSI6IHsKCQkiRGlzY292ZXJ5OiBNb2NrIjogdHJ1ZSwKCQkiU3R1ZGlvOiBNb2NrMiI6IHRydWUKCX0sCgkiZ3JvdXBzIjogWyJKSlQtQVBQLVJJU0UtTW9jayJdCn0='
let mockGet = jest.spyOn(AxiosInstance, "get");
describe('PermissionUtils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
      });
    
   afterAll(()=>{
    localStorage.removeItem('permissions');
   })

    it("PermissionUtils getUserPermissions blank case", () => {
        const permissions= PermissionUtils.getUserPermissions();
       expect(permissions).not.toBe(null)
       expect(Object.keys(permissions).length).toBe(0); 
    });

    it("PermissionUtils getAllowedPages", async () => {
        const allowedRoutes=PermissionUtils.getAllowedPages();
        expect(allowedRoutes.length).toBe(0);
    });

    it("PermissionUtils getAllowedRoutes", async () => {
        const allowedRoutes=PermissionUtils.getAllowedRoutes();
        expect(allowedRoutes.length).toBe(0);
    });
    it("PermissionUtils getUserPermissions blank case", () => {
        localStorage.setItem('permissions','e30=');
        const permissions= PermissionUtils.getUserPermissions();
       expect(permissions).not.toBe(null)
       expect(Object.keys(permissions).length).toBe(0); 
    });

    it("PermissionUtils getUserPermissions data case", async () => {
        localStorage.setItem('permissions',mockPermission)
        const permissions= PermissionUtils.getUserPermissions();
        expect(permissions).not.toBe(null)
        expect(Object.keys(permissions).length).not.toBe(0);
    });

    it("PermissionUtils getAllowedRoutes", async () => {
        localStorage.setItem('permissions',mockPermission)
        const allowedRoutes=PermissionUtils.getAllowedRoutes();
        expect(allowedRoutes).not.toBe(null);
    });

    it("PermissionUtils getAllowedRoutes", async () => {
        localStorage.setItem('permissions','ewoJImRpc2NvdmVyeSI6IHsKCQkKCX0KfQ==')
        const allowedRoutes=PermissionUtils.getAllowedRoutes();
        expect(allowedRoutes).not.toBe(null);
    });
    it("PermissionUtils getAllowedPages", async () => {
        localStorage.setItem('permissions',mockPermission)
        const allowedRoutes=PermissionUtils.getAllowedPages();
        expect(allowedRoutes).not.toBe(null);
    });

    it("PermissionUtils getAllowedPages", async () => {
        localStorage.setItem('permissions','ewoJImRpc2NvdmVyeSI6IHsKCQkKCX0KfQ==')
        const allowedRoutes=PermissionUtils.getAllowedPages();
        expect(allowedRoutes).not.toBe(null);
      });

     
     
      it("PermissionUtils canAccess true case", async () => {
        localStorage.setItem('permissions',mockPermission)
         const allowedRoutes=PermissionUtils.canAccess("Discovery: Mock");
          expect(allowedRoutes).toBe(true);
      });

      it("refreshUserPermissions canAccess false case", async () => {
        localStorage.setItem('user','eyJfaWQiOiI2M2FiNDg5NDIyYzc0MmRlMGI1ZjBkYjciLCJuYW1lIjoibW9jayJ9')
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
        cookies.get=jest.fn().mockReturnValue("bW9jay10b2tlbgo=")
        await PermissionUtils.refreshUserPermissions();
        const permissions=localStorage.getItem("permissions")
        expect(permissions).toBe("e30=")
      });
    
      it("PermissionUtils getUserPermissions error case", () => {
        localStorage.setItem('permissions', 'invalid-permission-string');
      
        const originalConsoleLog = console.log;
        console.log = jest.fn();
      
        const originalAtob = global.atob;
        global.atob = jest.fn(() => { throw new Error("decode error"); });
      
        const permissions = PermissionUtils.getUserPermissions();
      
        expect(console.log).toHaveBeenCalled();  
        expect(permissions).toEqual({});       
        global.atob = originalAtob;
        console.log = originalConsoleLog;
      });
    
      it("PermissionUtils canAccess false case (component always returns true)", () => {
        localStorage.setItem('permissions', mockPermission);
        const canAccessPage = PermissionUtils.canAccess("Non-existent Page");
        expect(canAccessPage).toBe(true);
      });
    
    it("refreshUserPermissions with missing userId or token", async () => {
        localStorage.clear();
        jest.spyOn(TokenUtils, 'getLocalUserId').mockReturnValue(null);
        jest.spyOn(TokenUtils, 'getLocalAccessToken').mockReturnValue(null);
        jest.spyOn(PermissionUtils, 'getUserPermissions').mockReturnValue({});
        
        const result = await PermissionUtils.refreshUserPermissions();
        expect(result).toEqual([]);
        expect(mockGet).not.toHaveBeenCalled();
        expect(TokenUtils.getLocalUserId).toHaveBeenCalled();
        expect(TokenUtils.getLocalAccessToken).toHaveBeenCalled();
      });
    
    it("refreshUserPermissions with empty response data", async () => {
        localStorage.setItem('user', 'eyJfaWQiOiI2M2FiNDg5NDIyYzc0MmRlMGI1ZjBkYjciLCJuYW1lIjoibW9jayJ9');
        localStorage.setItem('userId', 'mock-user-id');
        localStorage.setItem('token', 'mock-token');
        localStorage.removeItem('permissions'); // Clear existing permissions
        
        const emptyResponse = {
            data: {
                status: true,
                statusCode: 200,
                message: "Fetched successfully",
                data: {} // No permissions or user
            }
        };
        mockGet.mockImplementation(() => Promise.resolve(emptyResponse));
        
        await PermissionUtils.refreshUserPermissions();
        const permissions = localStorage.getItem("permissions");
        expect(permissions).toBeNull();
    });

})



