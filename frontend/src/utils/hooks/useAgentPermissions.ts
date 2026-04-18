/**
 * useAgentPermissions.ts
 *
 * React hook that exposes a `hasPermission(label)` helper for the agent
 * frontend.  Permission data is resolved in this priority order:
 *
 *  1. `userAuthorization.myPermissions` in the **agent MFE's own Redux store**
 *     (populated by the GET_MY_PERMISSIONS_REQUEST saga on app mount).
 *
 *  2. `permissions.permissions` in the **host app's Redux store**
 *     (`window.__REDUX_STORE__`, set by star-platform-mf) – used when the
 *     agent MFE has not yet fetched its own copy but the shell already has it.
 *
 * The check is intentionally broad: it scans all projects, not just "agent",
 * so the same hook works even if the backend groups things differently.
 *
 * Usage:
 *   const { hasPermission, loading } = useAgentPermissions();
 *   const canStartJob = hasPermission(AGENT_PERMISSIONS.JOB_READ);
 */

import { useSelector } from "react-redux";
import { getMyPermissions, isMyPermissionsLoading } from "../../redux/selectors/userAuthorization.selectors";
import type { ProjectPermission } from "../../types/UserAuthorization";

type HostStore = {
  getState: () => {
    permissions?: {
      permissions?: ProjectPermission[];
    };
    [key: string]: unknown;
  };
};

type GlobalWithReduxStore = typeof globalThis & {
  __REDUX_STORE__?: HostStore;
};

/** Pull the permission list from the host shell's Redux store (if available). */
const getHostPermissions = (): ProjectPermission[] | null => {
  try {
    const hostStore = (globalThis as GlobalWithReduxStore).__REDUX_STORE__;
    if (!hostStore) return null;
    const raw = hostStore.getState()?.permissions?.permissions;
    return Array.isArray(raw) ? raw : null;
  } catch {
    return null;
  }
};

/**
 * Returns `true` if `label` appears with `hasAccess: true` in any module of
 * any project within the provided permissions array.
 */
const checkLabel = (permissions: ProjectPermission[], label: string): boolean => {
  for (const project of permissions) {
    for (const mod of project.modules ?? []) {
      for (const perm of mod.permissions ?? []) {
        if (perm.label === label && perm.hasAccess) {
          return true;
        }
      }
    }
  }
  return false;
};

interface UseAgentPermissionsResult {
  /** Returns true when the current user holds the given permission label */
  hasPermission: (label: string) => boolean;
  /** True while the initial permissions fetch is in progress */
  loading: boolean;
  /** The raw permission tree (useful for debugging) */
  permissions: ProjectPermission[] | null;
}

export const useAgentPermissions = (): UseAgentPermissionsResult => {
  const myPermissions = useSelector(getMyPermissions);
  const loading = useSelector(isMyPermissionsLoading);

  console.log("[useAgentPermissions] myPermissions:", myPermissions);
  console.log("[useAgentPermissions] loading:", loading);
  console.log("[useAgentPermissions] hostPermissions:", getHostPermissions());

  const hasPermission = (label: string): boolean => {
    // 1. Own store
    if (myPermissions && myPermissions.length > 0) {
      const result = checkLabel(myPermissions, label);
      console.log(`[useAgentPermissions] hasPermission("${label}") → ${result} (own store)`);
      return result;
    }

    // 2. Host shell's store
    const hostPerms = getHostPermissions();
    if (hostPerms && hostPerms.length > 0) {
      const result = checkLabel(hostPerms, label);
      console.log(`[useAgentPermissions] hasPermission("${label}") → ${result} (host store)`);
      return result;
    }

    // No permissions loaded yet → deny access (fail-safe)
    console.log(`[useAgentPermissions] hasPermission("${label}") → false (no permissions loaded)`);
    return false;
  };

  return {
    hasPermission,
    loading,
    permissions: myPermissions ?? getHostPermissions(),
  };
};

export default useAgentPermissions;
