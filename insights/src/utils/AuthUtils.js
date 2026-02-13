import apiEndpoints from "../config/apiEndpoints";
import AuthService from "../services/auth/AuthService";
import UserService from "../services/auth/UserService";
import UtilizationService from "../services/auth/UtilizationService";
import TokenUtils, {
  getUserInfo,
  setLocalAccessToken,
  setLocalPermissions,
  setLocalUser,
} from "./TokenUtils";
import { cookies, history } from "./utils";

export const Logout = () => {
  if (getUserInfo()?.email)
    UtilizationService.utilizationMetrics("Logout", {
      Action: "Logout",
      userID: getUserInfo()?.email?.split("@")[0],
      Origin: "Auth Logout",
    });
  AuthService.logout(TokenUtils.getLocalUserId());
  removeUserSession();
  const timeout = 500;
  setTimeout(() => {
    history.push("/logout", { path: "/", domain: window.location.hostname });
  }, timeout);
};

export const Login = () => {
  window.open(`${apiEndpoints.auth.baseUrl}/v1/auth/authorize`, "_self");
};

export const LoginWithRedirectURL = (redirectUrl) => {
  sessionStorage.setItem("redirectUrl", redirectUrl);
  window.open(`/login?redirectUrl=${redirectUrl}`, "_self");
};

export const RedirectToDashboard = () => {
  history.push("/app/dashboard");
};

export const removeUserSession = () => {
  cookies.set("token", "bm8tYWNjZXNzLXRva2Vu", {
    path: "/",
    domain: window.location.hostname.includes("localhost")
      ? "localhost"
      : ".rise.apps.jnj.com",
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

export const RedirectToUnauthorized = () => {
  removeUserSession();
  const timeout = 500;
  setTimeout(() => {
    history.push("/unauthorized");
  }, timeout);
};

export const validateUser = async (token, userId) => {
  if (token && userId) {
    setLocalAccessToken(token);
    const response = await UserService.getUser(userId, token);
    await setLocalPermissions(response?.permissions);
    await setLocalUser(response?.user);
  } else {
    Login();
  }
};

const AuthUtils = {
  LoginWithRedirectURL,
  validateUser,
  RedirectToUnauthorized,
  removeUserSession,
  RedirectToDashboard,
  Login,
  Logout,
};

export default AuthUtils;