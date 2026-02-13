import userAuthorizationReducer from '../../../redux/reducers/userAuthorizationReducer';
import { AUTH } from '../../../config/actions';

describe('userAuthorizationReducer - REAL FUNCTIONAL TESTS', () => {
  const initialState = userAuthorizationReducer(undefined, { type: '' });

  // Test initial state
  it('returns initial state with dummy data', () => {
    const state = userAuthorizationReducer(undefined, { type: '' });
    expect(state.users).toBeDefined();
    expect(state.permissions).toBeDefined();
    expect(state.loading).toBe(false);
    expect(Array.isArray(state.users)).toBe(true);
    expect(state.users.length).toBe(0); // Initial state has empty users array
  });

  // Test GET_USERS_REQUEST
  it('handles GET_USERS_REQUEST action', () => {
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.GET_USERS_REQUEST,
    });
    expect(state.loading).toBe(true); // Should be true when requesting
    expect(state.error).toBeNull();
  });

  // Test GET_USERS_SUCCESS
  it('handles GET_USERS_SUCCESS with backend data', () => {
    const backendData = {
      data: {
        data: {
          users: [
            {
              id: 'u123',
              username: 'testuser',
              isActive: true,
              rolesCount: 2,
              createdBy: 'Admin',
              updatedBy: 'Admin',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-02T00:00:00Z',
            },
          ],
          pagination: { page: 1, limit: 10, total: 1 },
        },
      },
    };

    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.GET_USERS_SUCCESS,
      data: backendData,
    });

    expect(state.loading).toBe(false);
    expect(state.users.length).toBe(1);
    expect(state.users[0].id).toBe('u123');
    expect(state.users[0].userName).toBe('testuser');
    expect(state.pagination.total).toBe(1);
  });

  // Test GET_USERS_FAILURE
  it('handles GET_USERS_FAILURE action', () => {
    const errorPayload = { message: 'Failed to fetch users' };
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.GET_USERS_FAILURE,
      error: errorPayload,
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBeDefined();
  });

  // Test GET_PERMISSIONS_REQUEST
  it('handles GET_PERMISSIONS_REQUEST', () => {
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.PERMISSION.GET_PERMISSIONS_REQUEST,
    });
    expect(state.loading).toBe(true); // Should be true when requesting
  });

  // Test GET_PERMISSIONS_SUCCESS
  it('handles GET_PERMISSIONS_SUCCESS with data', () => {
    const backendData = {
      data: {
        data: {
          permissions: [
            {
              id: 'p1',
              project: 'agent',
              module: 'status',
              permission: 'read',
              code: 'agent:status:read',
              isActive: true,
            },
          ],
          pagination: { page: 1, limit: 10, total: 1 },
        },
      },
    };

    const state = userAuthorizationReducer(initialState, {
      type: AUTH.PERMISSION.GET_PERMISSIONS_SUCCESS,
      data: backendData,
    });

    expect(state.permissions.length).toBe(1);
    expect(state.permissions[0].id).toBe('p1');
    expect(state.permissionsPagination.total).toBe(1);
  });

  // Test GET_PERMISSIONS_FAILURE
  it('handles GET_PERMISSIONS_FAILURE', () => {
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.PERMISSION.GET_PERMISSIONS_FAILURE,
      error: { message: 'Failed' },
    });
    expect(state.loading).toBe(false);
  });

  // Test UPDATE_USER_REQUEST
  it('handles UPDATE_USER_REQUEST', () => {
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.UPDATE_USER_REQUEST,
    });
    expect(state.loading).toBe(true);
  });

  // Test UPDATE_USER_SUCCESS
  it('handles UPDATE_USER_SUCCESS with payload', () => {
    const updateData = {
      users: [
        {
          id: 'u1',
          username: 'updated_user',
          isActive: true,
          rolesCount: 3,
        },
      ],
    };

    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.UPDATE_USER_SUCCESS,
      payload: updateData,
    });

    expect(state.loading).toBe(false);
  });

  // Test DELETE_USER_REQUEST
  it('handles DELETE_USER_REQUEST', () => {
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.DELETE_USER_REQUEST,
    });
    expect(state.loading).toBe(true);
  });

  // Test DELETE_USER_SUCCESS
  it('handles DELETE_USER_SUCCESS', () => {
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.DELETE_USER_SUCCESS,
      payload: { userId: 'user001' },
    });
    expect(state.loading).toBe(false);
  });

  // Test ASSIGN_PERMISSION_REQUEST
  it('handles ASSIGN_PERMISSION_REQUEST', () => {
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.ASSIGN_PERMISSION_REQUEST,
    });
    expect(state.loading).toBe(false);
  });

  // Test ASSIGN_PERMISSION_SUCCESS
  it('handles ASSIGN_PERMISSION_SUCCESS', () => {
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.ASSIGN_PERMISSION_SUCCESS,
      payload: { userId: 'u1', permissions: ['p1', 'p2'] },
    });
    expect(state.loading).toBe(false);
  });

  // Test multiple sequential actions
  it('handles multiple sequential actions correctly', () => {
    let state = initialState;

    state = userAuthorizationReducer(state, {
      type: AUTH.USER.GET_USERS_REQUEST,
    });
    expect(state.loading).toBe(true); // Should be true during request

    state = userAuthorizationReducer(state, {
      type: AUTH.USER.GET_USERS_SUCCESS,
      data: {
        data: {
          data: {
            users: [{ id: 'u1', username: 'user1', isActive: true }],
            pagination: { page: 1, limit: 10, total: 1 },
          },
        },
      },
    });
    expect(state.users.length).toBe(1);

    state = userAuthorizationReducer(state, {
      type: AUTH.USER.GET_USERS_FAILURE,
      error: { message: 'Error' },
    });
    expect(state.error).toBeDefined();
  });

  // Test unknown action
  it('handles unknown action type', () => {
    const state = userAuthorizationReducer(initialState, {
      type: 'UNKNOWN_ACTION',
    });
    expect(state).toEqual(initialState);
  });

  // Test state immutability
  it('does not mutate original state', () => {
    const originalState = { ...initialState };
    const newState = userAuthorizationReducer(initialState, {
      type: AUTH.USER.GET_USERS_REQUEST,
    });
    expect(initialState).toEqual(originalState);
    expect(newState).not.toBe(initialState);
  });

  // Test empty data handling
  it('handles GET_USERS_SUCCESS with empty users array', () => {
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.GET_USERS_SUCCESS,
      data: {
        data: {
          data: {
            users: [],
            pagination: { page: 1, limit: 10, total: 0 },
          },
        },
      },
    });

    expect(state.users.length).toBe(0);
    expect(state.pagination.total).toBe(0);
  });

  // Test null data handling
  it('handles GET_USERS_SUCCESS with null data', () => {
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.GET_USERS_SUCCESS,
      data: { data: { data: null } },
    });

    expect(state.users.length).toBe(0);
  });
});
