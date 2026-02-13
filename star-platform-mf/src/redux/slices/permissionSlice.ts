import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActionPermission {
  label: string;
  hasAccess: boolean;
}

interface ModulePermission {
  module: string;
  hasAccess: boolean;
  permissions: ActionPermission[];
}

interface ProjectPermission {
  project: string;
  modules: ModulePermission[];
}

interface PermissionsState {
  permissions: ProjectPermission[];
  loaded: boolean;
  loading: boolean; 
}

const initialState: PermissionsState = {
  permissions: [],
  loading: false,

  loaded: false,
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
       setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPermissions: (state, action: PayloadAction<ProjectPermission[]>) => {
      state.permissions = action.payload;
      state.loaded = true;
    },
    clearPermissions: (state) => {
      state.permissions = [];
      state.loaded = false;
    },
  },
});

export const { setPermissions, clearPermissions } = permissionsSlice.actions;

export default permissionsSlice.reducer;
