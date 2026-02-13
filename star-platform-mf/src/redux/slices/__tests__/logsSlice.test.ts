import logsReducer, {
  setExecutionStatus,
  clearExecutionStatus,
  setIsManualFlowActivated,
} from '../logsSlice';

describe('executionLogsSlice', () => {
  const initialState = {
    executionStatuses: {},
    isManualFlowActivated: false,
  };

  it('should return the initial state', () => {
    expect(logsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setExecutionStatus', () => {
    const actual = logsReducer(
      initialState,
      setExecutionStatus({ executionId: 'exec-1', status: 'running' })
    );
    expect(actual.executionStatuses).toEqual({ 'exec-1': 'running' });
  });

  it('should handle multiple setExecutionStatus calls', () => {
    let state = logsReducer(
      initialState,
      setExecutionStatus({ executionId: 'exec-1', status: 'running' })
    );
    state = logsReducer(state, setExecutionStatus({ executionId: 'exec-2', status: 'completed' }));
    expect(state.executionStatuses).toEqual({
      'exec-1': 'running',
      'exec-2': 'completed',
    });
  });

  it('should update existing execution status', () => {
    const stateWithStatus = {
      ...initialState,
      executionStatuses: { 'exec-1': 'running' },
    };
    const actual = logsReducer(
      stateWithStatus,
      setExecutionStatus({ executionId: 'exec-1', status: 'completed' })
    );
    expect(actual.executionStatuses).toEqual({ 'exec-1': 'completed' });
  });

  it('should handle clearExecutionStatus', () => {
    const stateWithStatus = {
      ...initialState,
      executionStatuses: { 'exec-1': 'running', 'exec-2': 'completed' },
    };
    const actual = logsReducer(stateWithStatus, clearExecutionStatus('exec-1'));
    expect(actual.executionStatuses).toEqual({ 'exec-2': 'completed' });
  });

  it('should handle clearExecutionStatus for non-existent id', () => {
    const stateWithStatus = {
      ...initialState,
      executionStatuses: { 'exec-1': 'running' },
    };
    const actual = logsReducer(stateWithStatus, clearExecutionStatus('non-existent'));
    expect(actual.executionStatuses).toEqual({ 'exec-1': 'running' });
  });

  it('should handle setIsManualFlowActivated to true', () => {
    const actual = logsReducer(initialState, setIsManualFlowActivated(true));
    expect(actual.isManualFlowActivated).toBe(true);
  });

  it('should handle setIsManualFlowActivated to false', () => {
    const stateWithFlag = { ...initialState, isManualFlowActivated: true };
    const actual = logsReducer(stateWithFlag, setIsManualFlowActivated(false));
    expect(actual.isManualFlowActivated).toBe(false);
  });

  it('should maintain other state when updating isManualFlowActivated', () => {
    const stateWithData = {
      ...initialState,
      executionStatuses: { 'exec-1': 'running' },
    };
    const actual = logsReducer(stateWithData, setIsManualFlowActivated(true));
    expect(actual.executionStatuses).toEqual({ 'exec-1': 'running' });
    expect(actual.isManualFlowActivated).toBe(true);
  });
});
