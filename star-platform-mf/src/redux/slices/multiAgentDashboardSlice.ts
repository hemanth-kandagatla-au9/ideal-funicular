import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MultiAgentDashboardState {
  activeTab: string;
  searchTerm: string;
}

const initialState: MultiAgentDashboardState = {
  activeTab: 'All',
  searchTerm: '',
};

export const multiAgentDashboardSlice = createSlice({
  name: 'multiAgentDashboard',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
  },
});

export const { setActiveTab, setSearchTerm } = multiAgentDashboardSlice.actions;
export default multiAgentDashboardSlice.reducer;
