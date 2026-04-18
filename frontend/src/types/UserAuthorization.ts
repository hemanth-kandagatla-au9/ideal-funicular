export interface User {
  id: string;
  userName: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  rolesCount?: number;
}

export interface UserPagination {
  page: number;
  limit: number;
  total: number;
}

export interface UserFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserAuthorizationState {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: UserPagination;
  selectedUsers: string[]; // Array of user IDs
  userPermissions?: Permission[]; // Permissions for a specific user
  globalPermissions?: any; // Global permissions with user's current selections
  permissions: Permission[]; // Global permissions list
  permissionsPagination: PermissionPagination; // Pagination for permissions list
  /** Current logged-in user's project/module permission tree from getUserPermission API */
  myPermissions: ProjectPermission[] | null;
  myPermissionsLoading: boolean;
}

/** Shape returned by /auth/getUserPermission */
export interface ActionPermission {
  label: string;
  hasAccess: boolean;
}

export interface ModulePermission {
  module: string;
  hasAccess: boolean;
  permissions: ActionPermission[];
}

export interface ProjectPermission {
  project: string;
  modules: ModulePermission[];
}

export interface UserApiResponse {
  data: {
    flag: "success" | "error";
    data?: {
      users: User[];
      pagination: UserPagination;
    };
    error?: string;
  };
}

export interface Permission {
  id: string;
  project: string;
  module: string;
  permissions: string;
  role?: string; // Role field from backend
  createdAt: string;
  createdBy: string;
}

export interface PermissionPagination {
  page: number;
  limit: number;
  total: number;
}

export interface PermissionFilters {
  project?: string;
  module?: string;
  permission?: string;
  page?: number;
  limit?: number;
}

export interface PermissionItem {
  id: string; // Using code as id
  code: string;
  permission: string;
  description: string;
  granted: boolean;
  selected: boolean; // For UI state
}

export interface ModulePermissions {
  id: string; // Using module name as id
  module: string;
  permissions: PermissionItem[];
  allSelected: boolean; // For UI state
}

export interface ProjectPermissions {
  id: string; // Using project name as id
  project: string;
  modules: ModulePermissions[];
}
