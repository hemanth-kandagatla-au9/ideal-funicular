/**
 * Utils dependencies
 */
import apiEndpoints from "../config/apiEndpoints";
import AuthService from "../services/auth/AuthService";
import UserService from "../services/auth/UserService";
import UtilizationService from "../services/auth/UtilizationService";
import { getLocalUserId, getUserInfo, setLocalAccessToken, setLocalPermissions, setLocalUser } from "./TokenUtils";
import { cookies, history } from "./utils";

/**
 * Helper function to logout user
 */
export const Logout = (): void => {
  const userInfo = getUserInfo();
  if (userInfo?.email) {
    UtilizationService.utilizationMetrics("Logout", {
      Action: "Logout",
      userID: userInfo.email.split("@")[0],
      Origin: "Auth Logout",
    });
  }
  AuthService.logout(getLocalUserId());
  removeUserSession();
  const timeout = 500;
  setTimeout(() => {
    history.push("/logout", { path: "/", domain: window.location.hostname });
  }, timeout);
};

/**
 * Helper function to login user
 */
export const Login = (): void => {
  window.open(`${apiEndpoints.auth.baseUrl}/v1/auth/authorize`, "_self");
};

/**
 * Helper function to login user with redirect URL
 */
export const LoginWithRedirectURL = (redirectUrl: string): void => {
  sessionStorage.setItem("redirectUrl", redirectUrl);
  window.open(`/login?redirectUrl=${redirectUrl}`, "_self");
};

/**
 * Helper function for redirecting to dashboard.
 */
export const RedirectToDashboard = (): void => {
  history.push("/app/agent-management");
};

/**
 * Helper function to remove user session
 */
export const removeUserSession = (): void => {
  cookies.set("token", "bm8tYWNjZXNzLXRva2Vu", {
    path: "/",
    domain: window.location.hostname.includes("localhost") ? "localhost" : ".rise.apps.jnj.com",
  });

  cookies.remove("refreshToken", {
    path: "/",
    domain: window.location.hostname,
  });

  cookies.remove("user", {
    path: "/",
    domain: window.location.hostname,
  });

  localStorage.removeItem("user");
  localStorage.removeItem("permissions");
};

/**
 * Helper function to redirect user to unauthorized page
 */
export const RedirectToUnauthorized = (): void => {
  removeUserSession();
  const timeout = 500;
  setTimeout(() => {
    history.push("/unauthorized");
  }, timeout);
};

/**
 * Helper function for validating user
 */
export const validateUser = async (token: string | null, userId: string | null): Promise<void> => {
  if (token && userId) {
    setLocalAccessToken(token);
    const response = await UserService.getUser(userId, token);
    await setLocalPermissions(response.permissions);
    await setLocalUser(response.user);
  } else {
    Login();
  }
};

const AuthUtils = {
  validateUser,
  RedirectToUnauthorized,
  removeUserSession,
  RedirectToDashboard,
  Login,
  Logout,
};

/**
 * Exporting Auth utils
 */
export default AuthUtils;
