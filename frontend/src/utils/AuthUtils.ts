import apiEndpoints from "../config/apiEndpoints";
import AuthService from "../services/auth/AuthService";
import UserService from "../services/auth/UserService";
import UtilizationService from "../services/auth/UtilizationService";
import { getLocalUserId, getUserInfo, setLocalAccessToken, setLocalPermissions, setLocalUser } from "./TokenUtils";
import { cookies, history } from "./utils";


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


export const Login = (): void => {
  window.open(`${apiEndpoints.auth.baseUrl}/v1/auth/authorize`, "_self");
};


export const LoginWithRedirectURL = (redirectUrl: string): void => {
  sessionStorage.setItem("redirectUrl", redirectUrl);
  window.open(`/login?redirectUrl=${redirectUrl}`, "_self");
};


export const RedirectToDashboard = (): void => {
  history.push("/app/agent-management");
};


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


export const RedirectToUnauthorized = (): void => {
  removeUserSession();
  const timeout = 500;
  setTimeout(() => {
    history.push("/unauthorized");
  }, timeout);
};


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


export default AuthUtils;

