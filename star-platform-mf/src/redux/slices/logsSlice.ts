import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExecutionLogsState {
  executionStatuses: { [executionId: string]: string }; // Only track execution-level status
  isManualFlowActivated: boolean;
}

const initialState: ExecutionLogsState = {
  executionStatuses: {},
  isManualFlowActivated: false,
};

export const executionLogsSlice = createSlice({
  name: 'executionLogs',
  initialState,
  reducers: {
    setExecutionStatus: (state, action: PayloadAction<{ executionId: string; status: string }>) => {
      state.executionStatuses[action.payload.executionId] = action.payload.status;
    },
    clearExecutionStatus: (state, action: PayloadAction<string>) => {
      delete state.executionStatuses[action.payload];
    },

    setIsManualFlowActivated: (state, action: PayloadAction<boolean>) => {
      state.isManualFlowActivated = action.payload;
    },
  },
});

(executionLogsSlice as any).reducerPath = 'executionLogs';

export const { setExecutionStatus, clearExecutionStatus, setIsManualFlowActivated } =
  executionLogsSlice.actions;
export default executionLogsSlice.reducer;
