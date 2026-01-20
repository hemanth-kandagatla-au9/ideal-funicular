/**
 * User Authorization Types and Interfaces
 * Defines types for user management and authorization features
 */

/**
 * User interface - represents a single user in the system
 */
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

/**
 * Pagination interface for user list
 */
export interface UserPagination {
  page: number;
  limit: number;
  total: number;
}

/**
 * Filter options for user list
 */
export interface UserFilters {
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * User Authorization Redux State
 */
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
}

/**
 * API Response shape for user operations
 */
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

/**
 * Props for User Authorization component
 */
// export interface UserAuthorizationProps {
//   // Add component specific props as needed
// }

/**
 * Permission interface - represents a single permission in the system
 */
export interface Permission {
  id: string;
  project: string;
  module: string;
  permissions: string;
  role?: string; // Role field from backend
  createdAt: string;
  createdBy: string;
}

/**
 * Permission Pagination interface
 */
export interface PermissionPagination {
  page: number;
  limit: number;
  total: number;
}

/**
 * Permission Filters
 */
export interface PermissionFilters {
  project?: string;
  module?: string;
  permission?: string;
  page?: number;
  limit?: number;
}

/**
 * Permission Matrix Types (for assign permissions modal)
 */
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