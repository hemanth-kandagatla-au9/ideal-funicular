import { AUTH } from "../../config/actions";
import { UserAuthorizationState } from "../../types/UserAuthorization";

const initialState: UserAuthorizationState = {
  users: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  selectedUsers: [],
  permissions: [],
  globalPermissions: null,
  permissionsPagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

export default function userAuthorizationReducer(
  state = initialState,
  action: {
    type: string;
    [key: string]: any;
  },
) {
  switch (action.type) {
    case AUTH.USER.GET_USERS_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH.USER.GET_USERS_SUCCESS: {
      const backendData = action.data?.data?.data || {};
      const rawUsers = backendData.users || [];
      const backendPagination = backendData.pagination || {};

      const users = Array.isArray(rawUsers)
        ? rawUsers.map((user: any) => ({
            id: user.id,
            userName: user.username,
            isActive: user.isActive,
            rolesCount: user.rolesCount || 0,
            createdBy: user.createdBy || "Admin",
            updatedBy: user.updatedBy || "Admin",
            createdAt: user.createdAt || new Date().toISOString(),
            updatedAt: user.updatedAt || new Date().toISOString(),
          }))
        : [];

      return {
        ...state,
        loading: false,
        users,
        pagination: {
          page: backendPagination.page || 1,
          limit: backendPagination.limit || 10,
          total: backendPagination.total || 0,
        },
      };
    }

    case AUTH.USER.GET_USERS_FAILURE:
      return { ...state, loading: false, error: action.error };
    case AUTH.USER.CREATE_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH.USER.CREATE_USER_SUCCESS:
      return { ...state, loading: false };

    case AUTH.USER.CREATE_USER_FAILURE:
      return { ...state, loading: false, error: action.error };
    case AUTH.USER.UPDATE_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH.USER.UPDATE_USER_SUCCESS:
      return { ...state, loading: false };

    case AUTH.USER.UPDATE_USER_FAILURE:
      return { ...state, loading: false, error: action.error };
    case AUTH.USER.DELETE_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH.USER.DELETE_USER_SUCCESS:
      return { ...state, loading: false };

    case AUTH.USER.DELETE_USER_FAILURE:
      return { ...state, loading: false, error: action.error };
    case AUTH.USER.SELECT_USER: {
      const { userId } = action;
      const isSelected = state.selectedUsers.includes(userId);
      return {
        ...state,
        selectedUsers: isSelected ? state.selectedUsers.filter((id: string) => id !== userId) : [...state.selectedUsers, userId],
      };
    }

    case AUTH.USER.SELECT_ALL_USERS:
      return {
        ...state,
        selectedUsers: action.userIds || [],
      };

    case AUTH.USER.CLEAR_SELECTED_USERS:
      return {
        ...state,
        selectedUsers: [],
      };

    case AUTH.PERMISSION.GET_PERMISSIONS_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH.PERMISSION.GET_PERMISSIONS_SUCCESS: {
      const backendData = action.data?.data?.data || {};
      const rawPermissions = backendData.permissions || [];
      const backendPagination = backendData.pagination || state.permissionsPagination;

      return {
        ...state,
        permissions: rawPermissions,
        permissionsPagination: backendPagination,
        loading: false,
        error: null,
      };
    }

    case AUTH.PERMISSION.GET_PERMISSIONS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case AUTH.PERMISSION.CREATE_PERMISSION_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH.PERMISSION.CREATE_PERMISSION_SUCCESS:
      return { ...state, loading: false, error: null };

    case AUTH.PERMISSION.CREATE_PERMISSION_FAILURE:
      return { ...state, loading: false, error: action.error };

    case AUTH.PERMISSION.DELETE_PERMISSION_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH.PERMISSION.DELETE_PERMISSION_SUCCESS:
      return { ...state, loading: false, error: null };

    case AUTH.PERMISSION.DELETE_PERMISSION_FAILURE:
      return { ...state, loading: false, error: action.error };
    case AUTH.USER.FETCH_GLOBAL_PERMISSIONS_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH.USER.FETCH_GLOBAL_PERMISSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        globalPermissions: action.data?.data?.data || null,
      };

    case AUTH.USER.FETCH_GLOBAL_PERMISSIONS_FAILURE:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
