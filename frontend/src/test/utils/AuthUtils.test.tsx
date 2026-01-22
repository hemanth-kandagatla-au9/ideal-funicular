import AuthUtils, { LoginWithRedirectURL } from "../../utils/AuthUtils";import { cookies, history } from "../../utils/utils";
import * as TokenUtils from "../../utils/TokenUtils";
import * as UserService from "../../services/auth/UserService";
import * as AuthService from "../../services/auth/AuthService";
import * as UtilizationService from "../../services/auth/UtilizationService";

jest.mock('../../utils/utils', () => ({
  history: { push: jest.fn() },
  cookies: {
    set: jest.fn(),
    remove: jest.fn()
  }
}));

jest.mock('../../utils/TokenUtils', () => ({
  getUserInfo: jest.fn(),
  getLocalUserId: jest.fn(),
  setLocalAccessToken: jest.fn(),
  setLocalPermissions: jest.fn(),
  setLocalUser: jest.fn()
}));

jest.mock('../../services/auth/UserService', () => ({
  getUser: jest.fn()
}));

jest.mock('../../services/auth/AuthService', () => ({
  logout: jest.fn()
}));

jest.mock('../../services/auth/UtilizationService', () => ({
  utilizationMetrics: jest.fn()
}));

describe("Auth Utils Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location = { hostname: 'localhost' };
    Storage.prototype.setItem = jest.fn();
      Storage.prototype.removeItem = jest.fn();
      Storage.prototype.getItem = jest.fn();
      window.open = jest.fn();
    TokenUtils.getUserInfo.mockReturnValue({});
    TokenUtils.getLocalUserId.mockReturnValue(null);
  });

  describe("Login", () => {
    it("should open login URL", () => {
      AuthUtils.Login();
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('/v1/auth/authorize'),
        '_self'
      );
    });
  });

  describe("RedirectToDashboard", () => {
    it("should redirect to dashboard", () => {
      AuthUtils.RedirectToDashboard();
      expect(history.push).toHaveBeenCalledWith("/app/agent-management");
    });
  });

  describe("Logout", () => {
    it("should call utilizationMetrics when user has email", () => {
      TokenUtils.getUserInfo.mockReturnValue({ email: 'test@example.com' });
      TokenUtils.getLocalUserId.mockReturnValue('user123');
      
      AuthUtils.Logout();
      
      expect(UtilizationService.utilizationMetrics).toHaveBeenCalledWith(
        "Logout",
        {
          Action: "Logout",
          userID: "test",
          Origin: "Auth Logout"
        }
      );
      expect(AuthService.logout).toHaveBeenCalledWith('user123');
    });

    it("should not call utilizationMetrics when user has no email", () => {
      TokenUtils.getUserInfo.mockReturnValue({});
      AuthUtils.Logout();
      expect(UtilizationService.utilizationMetrics).not.toHaveBeenCalled();
    });
  });

  describe("removeUserSession", () => {
    it("should clear all user session data", () => {
      AuthUtils.removeUserSession();
      
      expect(cookies.set).toHaveBeenCalledWith(
        "token",
        "bm8tYWNjZXNzLXRva2Vu",
        { path: "/", domain: "localhost" }
      );
      expect(cookies.remove).toHaveBeenCalledWith(
        "refreshToken",
        { path: "/", domain: "localhost" }
      );
      expect(cookies.remove).toHaveBeenCalledWith(
        "user",
        { path: "/", domain: "localhost" }
      );
      expect(localStorage.removeItem).toHaveBeenCalledWith("user");
      expect(localStorage.removeItem).toHaveBeenCalledWith("permissions");
    });
  });

  describe("RedirectToUnauthorized", () => {
    it("should remove session and redirect after timeout", () => {
      jest.useFakeTimers();
      AuthUtils.RedirectToUnauthorized();
      expect(cookies.set).toHaveBeenCalled();
      expect(cookies.remove).toHaveBeenCalledTimes(2);
      expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
      jest.advanceTimersByTime(500);
      expect(history.push).toHaveBeenCalledWith('/unauthorized');
      jest.useRealTimers();
    });
  });

  describe("validateUser", () => {
    it("should set user data when token and userId are provided", async () => {
      const mockResponse = {
        user: { id: 1, name: "Test User" },
        permissions: ["read", "write"]
      };
      UserService.getUser.mockResolvedValue(mockResponse);
      
      await AuthUtils.validateUser("valid-token", "user123");
      
      expect(TokenUtils.setLocalAccessToken).toHaveBeenCalledWith("valid-token");
      expect(UserService.getUser).toHaveBeenCalledWith("user123", "valid-token");
      expect(TokenUtils.setLocalPermissions).toHaveBeenCalledWith(["read", "write"]);
    });

    it("should redirect to login when no token or userId", () => {
      AuthUtils.validateUser();
      expect(window.open).toHaveBeenCalled();
    });
  });

describe("Logout timeout redirect", () => {
    it("should redirect to logout after timeout", () => {
      jest.useFakeTimers();
      TokenUtils.getUserInfo.mockReturnValue({ email: 'test@example.com' });
      TokenUtils.getLocalUserId.mockReturnValue('user123');
      
      AuthUtils.Logout();
      jest.advanceTimersByTime(500);
      
      expect(history.push).toHaveBeenCalledWith(
        "/logout",
        { path: "/", domain: window.location.hostname }
      );
      jest.useRealTimers();
    });
  });
  describe("LoginWithRedirectURL", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      Storage.prototype.setItem = jest.fn();
      window.open = jest.fn();
    });
  
    it("should set redirectUrl in sessionStorage and open login page", () => {
      const redirectUrl = '/dashboard';
      LoginWithRedirectURL(redirectUrl);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'redirectUrl', 
        redirectUrl
      );
      expect(window.open).toHaveBeenCalledWith(
        `/login?redirectUrl=${redirectUrl}`,
        '_self'
      );
    });
  });
});



