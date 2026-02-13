import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  activeTab: string;
  searchTerm: string;
  apiCallTracking: Record<string, boolean>;
  allScriptOptions: any[];
  capabilityVersionNumber: string;
}

const initialState: DashboardState = {
  activeTab: 'All',
  searchTerm: '',
  apiCallTracking: {},
  allScriptOptions: [],
  capabilityVersionNumber: '',
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setApiCallTracking(state, action: PayloadAction<{ key: string; value: boolean }>) {
      state.apiCallTracking[action.payload.key] = action.payload.value;
    },
    setAllScriptOptions(state, action: PayloadAction<any[]>) {
      state.allScriptOptions = action.payload;
    },
    setCapabilityVersionNumber(state, action: PayloadAction<string>) {
      state.capabilityVersionNumber = action.payload;
    },
  },
});

export const {
  setActiveTab,
  setSearchTerm,
  setApiCallTracking,
  setAllScriptOptions,
  setCapabilityVersionNumber,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
