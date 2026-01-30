import TokenUtils from "../../utils/TokenUtils";
import { cookies } from "../../utils/utils";
jest.mock("../../utils/utils.ts", () => ({
  cookies: {
    get: jest.fn(),
    set: jest.fn()
  }
}));

describe('TokenUtils', () => {
    const originalWindowLocation = window.location;
    
    beforeAll(() => {
        delete window.location;
        window.location = new URL('http://localhost');
    });

    afterAll(() => {
        window.location = originalWindowLocation;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('TokenUtils getLocalUserId null case', () => {
        const userInfo = TokenUtils.getLocalUserId();
        expect(userInfo).toBe(null);
    });

    it('TokenUtils getUserInfo', () => {
        const userInfo = TokenUtils.getUserInfo();
        expect(userInfo).toEqual({});
    });

    it('TokenUtils setLocalUser null case', async () => {
        const result = await TokenUtils.setLocalUser();
        expect(result).toBe(false);
    });

    it('TokenUtils setLocalUser with data on localhost', async () => {
        const userInfo = { name: "test", id: "123" };
        await TokenUtils.setLocalUser(userInfo);
        expect(cookies.set).toHaveBeenCalledWith("user", expect.any(String), { path: "/", domain: "localhost" });
        expect(localStorage.getItem("user")).toBeDefined();
    });

    it('TokenUtils setLocalUser with data on production', async () => {
        window.location = new URL('https://rise.apps.jnj.com');
        
        const userInfo = { name: "test", id: "123" };
        await TokenUtils.setLocalUser(userInfo);
        expect(cookies.set).toHaveBeenCalledWith("user", expect.any(String), { path: "/", domain: ".rise.apps.jnj.com" });
        expect(localStorage.getItem("user")).toBeDefined();
    });

    it('TokenUtils getLocalAccessToken', () => {
        cookies.get.mockReturnValue("test-token");
        const token = TokenUtils.getLocalAccessToken();
        expect(token).toBe("test-token");
    });

    it('TokenUtils getLocalRefreshToken', () => {
        cookies.get.mockReturnValue("test-refresh-token");
        const token = TokenUtils.getLocalRefreshToken();
        expect(token).toBe("test-refresh-token");
    });

    it('TokenUtils isAdmin null case', () => {
        const result = TokenUtils.isAdmin();
        expect(result).toBe(false);
    });

    it('TokenUtils isAdmin with admin group', () => {
        const adminUser = {
            memberOf: ["JJT-APP-RISE-Admin"]
        };
        localStorage.setItem("user", btoa(JSON.stringify(adminUser)));
        expect(TokenUtils.isAdmin()).toBe(true);
    });

    it('TokenUtils getLocalUserId with valid user', () => {
        const testUser = { _id: "123" };
        localStorage.setItem("user", btoa(JSON.stringify(testUser)));
        expect(TokenUtils.getLocalUserId()).toBe("123");
    });

    it('TokenUtils updateLocalTokens on localhost', () => {
      window.location = new URL('http://localhost');
      TokenUtils.updateLocalTokens("access-token", "refresh-token");
      expect(cookies.set).toHaveBeenCalledWith("token", "access-token", { path: "/", domain: "localhost" });
      expect(cookies.set).toHaveBeenCalledWith("refreshToken", "refresh-token", { path: "/", domain: "localhost" });
  });

    it('TokenUtils updateLocalTokens on production', () => {
        window.location = new URL('https://rise.apps.jnj.com');
        
        TokenUtils.updateLocalTokens("access-token", "refresh-token");
        expect(cookies.set).toHaveBeenCalledWith("token", "access-token", { path: "/", domain: ".rise.apps.jnj.com" });
        expect(cookies.set).toHaveBeenCalledWith("refreshToken", "refresh-token", { path: "/", domain: ".rise.apps.jnj.com" });
    });

    it('TokenUtils setLocalAccessToken on localhost', () => {
      window.location = new URL('http://localhost');
      TokenUtils.setLocalAccessToken("test-token");
      expect(cookies.set).toHaveBeenCalledWith("token", "test-token", { path: "/", domain: "localhost" });
  });

    it('TokenUtils setLocalAccessToken on production', () => {
        window.location = new URL('https://rise.apps.jnj.com');
        
        TokenUtils.setLocalAccessToken("test-token");
        expect(cookies.set).toHaveBeenCalledWith("token", "test-token", { path: "/", domain: ".rise.apps.jnj.com" });
    });

    it('TokenUtils getUserGroups with no user', () => {
        const groups = TokenUtils.getUserGroups();
        expect(groups).toEqual([]);
    });

    it('TokenUtils getUserGroups with user', () => {
      const testUser = {
          memberOf: ["CN=ggroup1", "CN=ggroup2"] 
      };
      localStorage.setItem("user", btoa(JSON.stringify(testUser)));
      expect(TokenUtils.getUserGroups()).toEqual(["group1", "group2"]);
  });

    it('returns false when token is missing', () => {
        cookies.get.mockReturnValue(undefined);
        expect(TokenUtils.isBreakGlassEnabled()).toBe(false);
    });

    it('returns false when breakGlassEnabled is not set in the token', () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        cookies.get.mockReturnValue(token);
        expect(TokenUtils.isBreakGlassEnabled()).toBe(false);
    });

    it('returns true when breakGlassEnabled is set in the token', () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJicmVha0dsYXNzRW5hYmxlZCI6dHJ1ZX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        cookies.get.mockReturnValue(token);
        expect(TokenUtils.isBreakGlassEnabled()).toBe(true);
    });

    it('should return true for expired token', () => {
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjEzNDI2NzYsInVzZXJfaWQiOiIxMjM0NTY3ODkwIn0.OGvHgQ-oNwI7nZxMNpt8_lD_HAXjKuZZ7txPFL6_jzM';
        expect(TokenUtils.isTokenExpired(expiredToken)).toBe(true);
    });

    it('should return false for invalid token', () => {
        const invalidToken = 'invalidToken';
        expect(TokenUtils.isTokenExpired(invalidToken)).toBe(false);
    });
});


