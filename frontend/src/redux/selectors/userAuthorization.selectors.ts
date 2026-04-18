import { createSelector } from "reselect";

const getUserAuthorizationState = (state: any) => state.userAuthorization;
const EMPTY_ARRAY: any[] = [];
const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
};

export const getUsers = createSelector([getUserAuthorizationState], userAuth => userAuth?.users || EMPTY_ARRAY);

export const isUsersLoading = createSelector([getUserAuthorizationState], userAuth => userAuth?.loading || false);

export const getUsersError = createSelector([getUserAuthorizationState], userAuth => userAuth?.error || null);

export const getUsersPagination = createSelector([getUserAuthorizationState], userAuth => userAuth?.pagination || DEFAULT_PAGINATION);

export const getSelectedUsers = createSelector([getUserAuthorizationState], userAuth => userAuth?.selectedUsers || EMPTY_ARRAY);

export const getSelectedUsersCount = createSelector([getSelectedUsers], selectedUsers => selectedUsers.length);

export const getUserPermissions = createSelector([getUserAuthorizationState], userAuth => userAuth?.userPermissions || EMPTY_ARRAY);

export const getPermissions = createSelector([getUserAuthorizationState], userAuth => userAuth?.permissions || EMPTY_ARRAY);

export const getPermissionsPagination = createSelector([getUserAuthorizationState], userAuth => userAuth?.permissionsPagination || DEFAULT_PAGINATION);

export const isUserSelected = (state: any, userId: string) => {
  const selectedUsers = getSelectedUsers(state);
  return selectedUsers.includes(userId);
};

/** The current logged-in user's project/module permission tree */
export const getMyPermissions = createSelector([getUserAuthorizationState], userAuth => userAuth?.myPermissions ?? null);

export const isMyPermissionsLoading = createSelector([getUserAuthorizationState], userAuth => userAuth?.myPermissionsLoading ?? false);
