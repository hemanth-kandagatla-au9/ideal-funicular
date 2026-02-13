import { cookies } from "./utils";

export const isSessionValid = () => {
  const accessToken = cookies.get("msal_access_token");
  const expiry = cookies.get("tokenValidity");

  if (!accessToken || !expiry) return false;

  const expiryDate = new Date(expiry);
  const now = new Date();

  return now < expiryDate;
};

export const getLocalAccessToken = () =>
  sessionStorage.getItem("msal_id_token");

export const updateLocalTokens = (accessToken, refreshToken) => {
  if (new URL(window.location).hostname.includes("localhost")) {
    cookies.set("token", accessToken, { path: "/", domain: "localhost" });
    cookies.set("refreshToken", refreshToken, {
      path: "/",
      domain: "localhost",
    });
  } else {
    cookies.set("token", accessToken, {
      path: "/",
      domain: ".rise.apps.jnj.com",
    });
    cookies.set("refreshToken", refreshToken, {
      path: "/",
      domain: ".rise.apps.jnj.com",
    });
  }
};

export const setLocalAccessToken = (accessToken) => {
  if (new URL(window.location).hostname.includes("localhost")) {
    cookies.set("token", accessToken, { path: "/", domain: "localhost" });
  } else {
    cookies.set("token", accessToken, {
      path: "/",
      domain: ".rise.apps.jnj.com",
    });
  }
};

export const getLocalRefreshToken = () => cookies.get("refreshToken");

// export const getLocalAccessToken = () => cookies.get("token");

export const setLocalUser = async (userInfo) => {
  if (userInfo) {
    const baseEncodedUser = btoa(JSON.stringify(userInfo));
    if (new URL(window.location).hostname.includes("localhost")) {
      cookies.set("user", baseEncodedUser, { path: "/", domain: "localhost" });
    } else {
      cookies.set("user", baseEncodedUser, {
        path: "/",
        domain: ".rise.apps.jnj.com",
      });
    }
    return localStorage.setItem("user", baseEncodedUser);
  }
  return false;
};

export const setLocalPermissions = async (permissions) => {
  if (permissions) {
    const baseEncodedPermission = btoa(JSON.stringify(permissions));
    return localStorage.setItem("permissions", baseEncodedPermission);
  }
  return false;
};

export const getUserInfo = () => {
  let userInfo = {};
  const userCookieInfo = localStorage.getItem("user");
  if (userCookieInfo)
    userInfo = { ...JSON.parse(atob(decodeURIComponent(userCookieInfo))) };

  return userInfo;
};

export const getUserGroups = () => {
  let userInfo = {};
  const userCookieInfo = localStorage.getItem("user");
  if (userCookieInfo)
    userInfo = { ...JSON.parse(atob(decodeURIComponent(userCookieInfo))) };
  const NON_FUNCTIONAL_GROUP = [
    "JJT-APP-RISE-DEV",
    "JJT-APP-RISE-PREDEV",
    "JJT-APP-RISE-QA",
    "JJT-APP-RISE-PROD",
    "JJT-APP-RISE-DB-OPSMGR-ADMIN",
    "JJT-APP-RISE-DB-READONLY-NONPROD",
    "JJT-APP-RISE-DB-READONLY-PROD",
    "JJT-APP-RISE-DB-READWRITE-NONPROD",
  ];
  if (userInfo.memberOf)
    userInfo.memberOf = userInfo.memberOf.filter(
      (group) => !NON_FUNCTIONAL_GROUP.includes(group.toUpperCase())
    );
  const groupInfo = [];
  for (let x = 0; x < userInfo?.memberOf?.length; x += 1) {
    groupInfo.push(userInfo.memberOf[x].slice(4));
  }
  return groupInfo;
};

export const getLocalUserId = () => {
  let userInfo = { _id: null };
  try {
    const userCookieInfo = localStorage.getItem("user");
    userInfo = { ...JSON.parse(atob(decodeURIComponent(userCookieInfo))) };
    return userInfo._id;
  } catch (err) {
    return userInfo._id;
  }
};
export const isAdmin = () => {
  let userInfo = { memberOf: [] };

  try {
    const userCookieInfo = localStorage.getItem("user");

    userInfo = { ...JSON.parse(atob(decodeURIComponent(userCookieInfo))) };

    return userInfo.memberOf.includes("JJT-APP-RISE-Admin");
  } catch (err) {
    return false;
  }
};

export const isBreakGlassEnabled = () => {
  const token = getLocalAccessToken();
  let decoded = {};
  if (token && token.includes("."))
    decoded = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf-8")
    );
  return decoded?.breakGlassEnabled || false;
};

export const isTokenExpired = (token) => {
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  } catch (_e) {
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
