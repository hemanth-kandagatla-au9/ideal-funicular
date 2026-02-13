import UserService from "../services/auth/UserService";
import { getLocalAccessToken, getLocalUserId, setLocalPermissions, setLocalUser } from "./TokenUtils";
import { Logout } from "./AuthUtils";

export const getUserPermissions = () => {
  let userPermissions = {};
  try {
    const permissions = localStorage.getItem("permissions");
    if (permissions) {
      userPermissions = {
        ...JSON.parse(atob(decodeURIComponent(permissions))),
      };
    }
  } catch (err) {
    Logout();
  }
  return userPermissions;
};

export const getAllowedRoutes = () => {
  const allowedRoutes = [];
  const permissionsData = getUserPermissions();
  allowedRoutes.push(...Object.keys(permissionsData));
  if (allowedRoutes.length > 0) {
    for (const permission in permissionsData) {
      if (Object.prototype.hasOwnProperty.call(permissionsData, permission)) {
        allowedRoutes.push(...Object.keys(permissionsData[permission]).map(PerRoute => PerRoute.toLowerCase()));
      }
    }
    allowedRoutes.forEach(route => route.toLowerCase());
  }
  return allowedRoutes;
};

export const getAllowedPages = () => {
  const allowedPages = [];
  const permissionsData = getUserPermissions();
  if (permissionsData) allowedPages.push(...Object.keys(permissionsData));
  return allowedPages;
};

export const canAccess = pageTitle => {
  let canAccessPage = false;
  const permissionsData = getUserPermissions();
  if (permissionsData && pageTitle && typeof pageTitle == "string") {
    for (const permission in permissionsData) {
      if (typeof permissionsData[permission][pageTitle] != "undefined") {
        canAccessPage = true;
      }
    }
  }
  return canAccessPage;
};

export const refreshUserPermissions = async () => {
  const userId = getLocalUserId();
  const token = getLocalAccessToken();
  if (userId && token) {
    const response = await UserService.getUser(userId, token);
    if (response.permissions) await setLocalPermissions(response.permissions);
    if (response.user) await setLocalUser(response.user);
  }
  return getAllowedRoutes();
};

const PermissionUtils = {
  canAccess,
  getAllowedPages,
  getAllowedRoutes,
  getUserPermissions,
  refreshUserPermissions,
};

export default PermissionUtils;
