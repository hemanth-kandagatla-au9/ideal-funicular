import executionReducer, {
  setExecutionId,
  clearExecutionId,
  setVersionNumber,
  clearVersionNumber,
  setHostname,
} from '../executionSlice';

describe('executionSlice', () => {
  const initialState = {
    executionId: null,
    versionNumber: null,
    hostname: null,
  };

  it('should return the initial state', () => {
    expect(executionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setExecutionId', () => {
    const actual = executionReducer(initialState, setExecutionId('exec-123'));
    expect(actual.executionId).toEqual('exec-123');
  });

  it('should handle clearExecutionId', () => {
    const stateWithId = { ...initialState, executionId: 'exec-123' };
    const actual = executionReducer(stateWithId, clearExecutionId());
    expect(actual.executionId).toBeNull();
  });

  it('should handle setVersionNumber', () => {
    const actual = executionReducer(initialState, setVersionNumber('v2.0.0'));
    expect(actual.versionNumber).toEqual('v2.0.0');
  });

  it('should handle clearVersionNumber', () => {
    const stateWithVersion = { ...initialState, versionNumber: 'v1.0.0' };
    const actual = executionReducer(stateWithVersion, clearVersionNumber());
    expect(actual.versionNumber).toBeNull();
  });

  it('should handle setHostname with string', () => {
    const actual = executionReducer(initialState, setHostname('server-01'));
    expect(actual.hostname).toEqual('server-01');
  });

  it('should handle setHostname with null', () => {
    const stateWithHostname = { ...initialState, hostname: 'server-01' };
    const actual = executionReducer(stateWithHostname, setHostname(null));
    expect(actual.hostname).toBeNull();
  });

  it('should maintain other state when updating executionId', () => {
    const stateWithData = {
      ...initialState,
      versionNumber: 'v1.0.0',
      hostname: 'server-01',
    };
    const actual = executionReducer(stateWithData, setExecutionId('new-exec-id'));
    expect(actual.executionId).toEqual('new-exec-id');
    expect(actual.versionNumber).toEqual('v1.0.0');
    expect(actual.hostname).toEqual('server-01');
  });

  it('should handle multiple operations in sequence', () => {
    let state = executionReducer(initialState, setExecutionId('exec-1'));
    state = executionReducer(state, setVersionNumber('v1.5.0'));
    state = executionReducer(state, setHostname('production-server'));

    expect(state).toEqual({
      executionId: 'exec-1',
      versionNumber: 'v1.5.0',
      hostname: 'production-server',
    });
  });
});
