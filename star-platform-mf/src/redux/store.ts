import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

import { nodeSlice } from './slices/nodeSlice';
import { workFlowSlice } from './slices/workflowSlice';
import { vaultSlice } from './slices/vaultSlice';
// import { multiAgentSlice } from "./slices/agentSlice";
import executionLogsReducer from './slices/logsSlice';
import dashboardReducer from './slices/dashboardSlice';
import multiAgentDashboardReducer from './slices/multiAgentDashboardSlice';
import { nodeManagementSlice } from './slices/nodeManagementSlice';
import { scriptsSlice } from './slices/scriptSclice';
// import { scriptTypeSlice } from "./slices/scriptTypeSlice";
import { hostServerSlice } from './slices/hostServerSlice';
import { analyticsApi } from './slices/analyticsSlice';
import { settingSlice } from './slices/settingSlice';
import { approvalSlice } from './slices/approvalSlice';
import executionReducer from './slices/executionSlice';
import { authApi } from './slices/authSlice';
import templateSliceReducer from './slices/templateSlice';
import permissionReducer from './slices/permissionSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['execution', 'permissions'], // Only persist execution slice
  // You can also blacklist specific reducers with:
  // blacklist: ['someReducerKey']
};

// Combine all reducers
const rootReducer = combineReducers({
  [nodeSlice.reducerPath]: nodeSlice.reducer,
  [workFlowSlice.reducerPath]: workFlowSlice.reducer,
  [vaultSlice.reducerPath]: vaultSlice.reducer,
  [nodeManagementSlice.reducerPath]: nodeManagementSlice.reducer,
  [scriptsSlice.reducerPath]: scriptsSlice.reducer,
  // [multiAgentSlice.reducerPath]: multiAgentSlice.reducer,
  // [scriptTypeSlice.reducerPath]: scriptTypeSlice.reducer,
  [hostServerSlice.reducerPath]: hostServerSlice.reducer,
  [analyticsApi.reducerPath]: analyticsApi.reducer,
  [settingSlice.reducerPath]: settingSlice.reducer,
  [approvalSlice.reducerPath]: approvalSlice.reducer,
  [authApi.reducerPath]: authApi.reducer,
  // permissions: permissionsReducer,
  executionLogs: executionLogsReducer,
  dashboard: dashboardReducer,
  multiAgentDashboard: multiAgentDashboardReducer,
  execution: executionReducer,
  permissions: permissionReducer,
  // templateSlice : templateSliceReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(nodeSlice.middleware)
      .concat(workFlowSlice.middleware)
      .concat(vaultSlice.middleware)
      // .concat(multiAgentSlice.middleware)
      // .concat(nodeManagementSlice.middleware)
      .concat(scriptsSlice.middleware)
      // .concat(scriptTypeSlice.middleware)
      .concat(hostServerSlice.middleware)
      .concat(analyticsApi.middleware)
      .concat(settingSlice.middleware)
      .concat(approvalSlice.middleware)
      .concat(authApi.middleware),
});

if (typeof window !== 'undefined') {
  (window as any).__REDUX_STORE__ = store;
}

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
