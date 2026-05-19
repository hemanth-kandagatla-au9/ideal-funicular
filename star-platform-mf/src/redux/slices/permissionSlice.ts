import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActionPermission {
  label: string;
  hasAccess: boolean;
}

interface ModulePermission {
  module: string;
  hasAccess: boolean;
  permissions?: ActionPermission[];
}

interface PermissionProject {
  project: string;
  modules: ModulePermission[];
}

interface PermissionsState {
  permissions: PermissionProject[];
  isLoading: boolean;
  isError: boolean;
  isSessionExpired: boolean;
  loaded: boolean;
}

const initialState: PermissionsState = {
  permissions: [],
  isLoading: true,
  isError: false,
  isSessionExpired: false,
  loaded: false,
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<PermissionProject[]>) => {
      state.permissions = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.isSessionExpired = false;
      state.loaded = true;
    },
    clearPermissions: (state) => {
      state.permissions = [];
      state.isLoading = true;
      state.isError = false;
      state.isSessionExpired = false;
      state.loaded = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPermissionsError: (state) => {
      state.isLoading = false;
      state.isError = true;
      state.isSessionExpired = false;
      state.loaded = true;
    },
    setSessionExpired: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSessionExpired = true;
      state.loaded = true;
    },
  },
});

export const {
  setPermissions,
  clearPermissions,
  setLoading,
  setPermissionsError,
  setSessionExpired,
} = permissionsSlice.actions;

export default permissionsSlice.reducer;
