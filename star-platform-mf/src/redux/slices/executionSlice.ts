// redux/slices/executionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExecutionState {
  executionId: string | null;
  versionNumber: string | null;
  hostname: string | null;
}

const initialState: ExecutionState = {
  executionId: null,
  versionNumber: null,
  hostname: null,
};

const executionSlice = createSlice({
  name: 'execution',
  initialState,
  reducers: {
    setExecutionId: (state, action: PayloadAction<string>) => {
      state.executionId = action.payload;
    },
    clearExecutionId: (state) => {
      state.executionId = null;
    },
    setVersionNumber: (state, action: PayloadAction<string>) => {
      state.versionNumber = action.payload;
    },
    clearVersionNumber: (state) => {
      state.versionNumber = null;
    },
    setHostname: (state, action: PayloadAction<string | null>) => {
      state.hostname = action.payload;
    },
  },
});

export const {
  setExecutionId,
  clearExecutionId,
  setVersionNumber,
  clearVersionNumber,
  setHostname,
} = executionSlice.actions;

export default executionSlice.reducer;
