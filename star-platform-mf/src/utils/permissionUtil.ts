export interface PermissionAction {
  label: string;
  hasAccess: boolean;
}

export interface PermissionModule {
  module: string;
  hasAccess: boolean;
  permissions?: PermissionAction[];
}

export interface PermissionProject {
  project: string;
  modules: PermissionModule[];
}

export interface PermissionApiResponse {
  flag?: string;
  message?: string;
  data?: {
    permissions?: PermissionProject[];
  };
}

const normalize = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toLowerCase();

const toArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

export const normalizePermissions = (
  payload: PermissionProject[] | PermissionApiResponse | undefined
): PermissionProject[] => {
  if (!payload) return [];

  if (Array.isArray(payload)) return payload;

  return payload?.data?.permissions ?? [];
};

export const hasPermission = (
  rawPermissions: PermissionProject[] | PermissionApiResponse | undefined,
  projectName: string,
  moduleName: string,
  permissionLabel?: string
): boolean => {
  const permissions = normalizePermissions(rawPermissions);
  if (!permissions.length) return false;

  const insightsProject = permissions.find((p) => normalize(p.project) === 'insights');
  if (!insightsProject) return false;

  const targetModule = toArray<PermissionModule>(insightsProject.modules).find(
    (m) => normalize(m.module) === normalize(moduleName)
  );
  if (!targetModule || !targetModule.hasAccess) return false;

  if (!permissionLabel) return true;

  const action = toArray<PermissionAction>(targetModule.permissions).find(
    (perm) => normalize(perm.label) === normalize(permissionLabel)
  );
  return Boolean(action?.hasAccess);
};
