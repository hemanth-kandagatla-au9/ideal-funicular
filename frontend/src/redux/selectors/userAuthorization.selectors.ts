/**
 * User Authorization Selectors
 * Provides access to user authorization state
 */
import { createSelector } from "reselect";

// Base selector
const getUserAuthorizationState = (state: any) => state.userAuthorization;

// Default values as constants to prevent new object creation
const EMPTY_ARRAY: any[] = [];
const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
};

/**
 * Get users list from state
 */
export const getUsers = createSelector([getUserAuthorizationState], userAuth => userAuth?.users || EMPTY_ARRAY);

/**
 * Get loading state
 */
export const isUsersLoading = createSelector([getUserAuthorizationState], userAuth => userAuth?.loading || false);

/**
 * Get error state
 */
export const getUsersError = createSelector([getUserAuthorizationState], userAuth => userAuth?.error || null);

/**
 * Get pagination data
 */
export const getUsersPagination = createSelector([getUserAuthorizationState], userAuth => userAuth?.pagination || DEFAULT_PAGINATION);

/**
 * Get selected users
 */
export const getSelectedUsers = createSelector([getUserAuthorizationState], userAuth => userAuth?.selectedUsers || EMPTY_ARRAY);

/**
 * Get count of selected users
 */
export const getSelectedUsersCount = createSelector([getSelectedUsers], selectedUsers => selectedUsers.length);


/**
 * Get user permissions
 */
export const getUserPermissions = createSelector([getUserAuthorizationState], userAuth => userAuth?.userPermissions || EMPTY_ARRAY);


/**
 * Get permissions list
 */
export const getPermissions = createSelector([getUserAuthorizationState], userAuth => userAuth?.permissions || EMPTY_ARRAY);

/**
 * Get permissions pagination
 */
export const getPermissionsPagination = createSelector([getUserAuthorizationState], userAuth => userAuth?.permissionsPagination || DEFAULT_PAGINATION);


/**
 * Check if a specific user is selected
 */
export const isUserSelected = (state: any, userId: string) => {
  const selectedUsers = getSelectedUsers(state);
  return selectedUsers.includes(userId);
};