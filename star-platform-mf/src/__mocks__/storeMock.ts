import { configureStore } from '@reduxjs/toolkit';

// Create a mock store for testing
export const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      executionLogs: (state = {}) => state,
      dashboard: (state = {}) => state,
      multiAgentDashboard: (state = {}) => state,
      execution: (state = {}) => state,
      permissions: (state = {}) => state,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export const mockStore = createMockStore();

export default mockStore;
