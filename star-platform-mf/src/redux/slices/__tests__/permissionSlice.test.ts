import permissionsReducer, {
  setPermissions,
  clearPermissions,
  setPermissionsLoading,
} from '../permissionSlice';

describe('permissionsSlice', () => {
  const initialState = {
    permissions: [],
    isLoading: true,
  };

  const mockPermissions = [
    {
      project: 'Project A',
      modules: [
        {
          module: 'Module 1',
          hasAccess: true,
          permissions: [
            { label: 'Read', hasAccess: true },
            { label: 'Write', hasAccess: false },
          ],
        },
      ],
    },
    {
      project: 'Project B',
      modules: [
        {
          module: 'Module 2',
          hasAccess: false,
          permissions: [{ label: 'Admin', hasAccess: false }],
        },
      ],
    },
  ];

  it('should return the initial state', () => {
    expect(permissionsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should start with isLoading as true', () => {
    const state = permissionsReducer(undefined, { type: 'unknown' });
    expect(state.isLoading).toBe(true);
  });

  it('should handle setPermissions', () => {
    const actual = permissionsReducer(initialState, setPermissions(mockPermissions));
    expect(actual.permissions).toEqual(mockPermissions);
    expect(actual.isLoading).toBe(false);
  });

  it('should set isLoading to false when permissions are set', () => {
    const stateLoading = { ...initialState, isLoading: true };
    const actual = permissionsReducer(stateLoading, setPermissions(mockPermissions));
    expect(actual.isLoading).toBe(false);
  });

  it('should handle clearPermissions', () => {
    const stateWithPermissions = {
      permissions: mockPermissions,
      isLoading: false,
    };
    const actual = permissionsReducer(stateWithPermissions, clearPermissions());
    expect(actual.permissions).toEqual([]);
    expect(actual.isLoading).toBe(true);
  });

  it('should reset isLoading to true when permissions are cleared', () => {
    const stateWithData = {
      permissions: mockPermissions,
      isLoading: false,
    };
    const actual = permissionsReducer(stateWithData, clearPermissions());
    expect(actual.isLoading).toBe(true);
  });

  it('should handle setPermissionsLoading to true', () => {
    const stateNotLoading = { ...initialState, isLoading: false };
    const actual = permissionsReducer(stateNotLoading, setPermissionsLoading(true));
    expect(actual.isLoading).toBe(true);
  });

  it('should handle setPermissionsLoading to false', () => {
    const actual = permissionsReducer(initialState, setPermissionsLoading(false));
    expect(actual.isLoading).toBe(false);
  });

  it('should maintain permissions when toggling isLoading', () => {
    const stateWithData = {
      permissions: mockPermissions,
      isLoading: false,
    };
    const actual = permissionsReducer(stateWithData, setPermissionsLoading(true));
    expect(actual.permissions).toEqual(mockPermissions);
    expect(actual.isLoading).toBe(true);
  });

  it('should handle empty permissions array', () => {
    const actual = permissionsReducer(initialState, setPermissions([]));
    expect(actual.permissions).toEqual([]);
    expect(actual.isLoading).toBe(false);
  });
});
