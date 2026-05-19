import reducer, {
  setPermissions,
  clearPermissions,
  // IMPORTANT: import this as well
  // (you need to export it in slice first)
  setLoading,
} from '../../slices/permissionSlice';

describe('permissionsSlice', () => {
  const initialState = {
    permissions: [],
    isLoading: true,
    isError: false,
    isSessionExpired: false,
    loaded: false,
  };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setPermissions', () => {
    const mockPayload = [
      {
        project: 'Test Project',
        modules: [
          {
            module: 'Dashboard',
            hasAccess: true,
            permissions: [{ label: 'View', hasAccess: true }],
          },
        ],
      },
    ];

    const nextState = reducer(initialState, setPermissions(mockPayload));

    expect(nextState.permissions).toEqual(mockPayload);
    expect(nextState.loaded).toBe(true);
  });

  it('should handle clearPermissions', () => {
    const populatedState = {
      permissions: [{ project: 'Test', modules: [] }],
      isLoading: false,
      isError: false,
      isSessionExpired: false,
      loaded: true,
    };

    const nextState = reducer(populatedState, clearPermissions());

    expect(nextState.permissions).toEqual([]);
    expect(nextState.loaded).toBe(false);
  });
});
