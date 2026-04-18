import UserService from "../services/auth/UserService";
import { getLocalAccessToken, getLocalUserId, setLocalPermissions, setLocalUser } from "./TokenUtils";
import { Logout } from "./AuthUtils";
import type { ProjectPermission } from "../types/UserAuthorization";

type PermissionsData = {
  [key: string]: {
    [key: string]: any;
  };
};

export const getUserPermissions = (): PermissionsData => {
  let userPermissions: PermissionsData = {};
  try {
    const permissions = localStorage.getItem("permissions");
    if (permissions) {
      userPermissions = {
        ...JSON.parse(atob(decodeURIComponent(permissions))),
      };
    }
  } catch (err) {
    console.log(err);
    Logout();
  }
  return userPermissions;
};

export const getAllowedRoutes = (): string[] => {
  const allowedRoutes: string[] = [];
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

export const getAllowedPages = (): string[] => {
  const allowedPages: string[] = [];
  const permissionsData = getUserPermissions();
  if (permissionsData) allowedPages.push(...Object.keys(permissionsData));
  return allowedPages;
};

export const canAccess = (pageTitle: string): boolean => {
  let canAccessPage = false;
  const permissionsData = getUserPermissions();
  if (permissionsData && pageTitle && typeof pageTitle === "string") {
    for (const permission in permissionsData) {
      if (typeof permissionsData[permission][pageTitle] !== "undefined") {
        canAccessPage = true;
      }
    }
  }
  return canAccessPage; // fixed: was always returning true regardless of check
};

export const refreshUserPermissions = async (): Promise<string[]> => {
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
