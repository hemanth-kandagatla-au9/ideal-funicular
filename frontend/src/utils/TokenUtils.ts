import { cookies } from "./utils";
import { getIdToken, getAccessToken } from "./TokenService";

interface UserInfo {
  _id?: string;
  email?: string;
  memberOf?: string[];
  [key: string]: unknown;
}

interface TokenPayload {
  exp?: number;
  breakGlassEnabled?: boolean;
  [key: string]: unknown;
}

export const updateLocalTokens = (accessToken: string, refreshToken: string): void => {
  const domain = window.location.hostname.includes("localhost") ? "localhost" : ".rise.apps.jnj.com";
  cookies.set("token", accessToken, { path: "/", domain });
  cookies.set("refreshToken", refreshToken, { path: "/", domain });
};

export const setLocalAccessToken = (accessToken: string): void => {
  const domain = window.location.hostname.includes("localhost") ? "localhost" : ".rise.apps.jnj.com";
  cookies.set("token", accessToken, { path: "/", domain });
};

export const getLocalRefreshToken = (): string | undefined => cookies.get("refreshToken");
// Prefer the platform SSO cookie; fall back to the legacy app-written cookie
export const getLocalAccessToken = (): string | undefined => cookies.get("iasphere_access_token") ?? cookies.get("token");

export const setLocalUser = async (userInfo: UserInfo): Promise<true | false> => {
  if (userInfo) {
    const baseEncodedUser = btoa(JSON.stringify(userInfo));
    const domain = window.location.hostname.includes("localhost") ? "localhost" : ".rise.apps.jnj.com";
    cookies.set("user", baseEncodedUser, { path: "/", domain });
    localStorage.setItem("user", baseEncodedUser);
    return true;
  }
  return false;
};

export const setLocalPermissions = async (permissions: Record<string, unknown>): Promise<true | false> => {
  if (permissions) {
    const baseEncodedPermission = btoa(JSON.stringify(permissions));
    localStorage.setItem("permissions", baseEncodedPermission);
    return true;
  }
  return false;
};

export const getUserInfo = (): UserInfo => {
  try {
    const userCookieInfo = localStorage.getItem("user");
    if (userCookieInfo) {
      return { ...JSON.parse(atob(decodeURIComponent(userCookieInfo))) };
    }
  } catch (err) {
    console.error("Failed to decode user info:", err);
  }
  return {};
};

export const getUserGroups = (): string[] => {
  const userInfo = getUserInfo();
  const groupInfo: string[] = [];

  userInfo?.memberOf?.forEach((group: string) => {
    groupInfo.push(group.slice(4));
  });

  return groupInfo;
};

export const getLocalUserId = (): string | null => {
  try {
    const userCookieInfo = localStorage.getItem("user");
    const userInfo: UserInfo = JSON.parse(atob(decodeURIComponent(userCookieInfo!)));
    return userInfo?._id || null;
  } catch {
    return null;
  }
};

export const isAdmin = (): boolean => {
  try {
    const userCookieInfo = localStorage.getItem("user");
    const userInfo: UserInfo = JSON.parse(atob(decodeURIComponent(userCookieInfo!)));
    return userInfo.memberOf?.includes("JJT-APP-RISE-Admin") ?? false;
  } catch {
    return false;
  }
};

export const isBreakGlassEnabled = (): boolean => {
  const token = getLocalAccessToken();
  if (token && token.includes(".")) {
    try {
      const payload: TokenPayload = JSON.parse(atob(token.split(".")[1]));
      return payload.breakGlassEnabled ?? false;
    } catch {
      return false;
    }
  }
  return false;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: TokenPayload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp! < currentTime;
  } catch {
    return false;
  }
};

const TokenUtils = {
  getLocalUserId,
  getUserInfo,
  setLocalPermissions,
  setLocalUser,
  getLocalAccessToken,
  getLocalRefreshToken,
  setLocalAccessToken,
  updateLocalTokens,
  isAdmin,
  getUserGroups,
  isBreakGlassEnabled,
  isTokenExpired,
};

export default TokenUtils;
