/**
 * userAuthorizationPermissionsReducer.test.tsx
 *
 * Tests for the GET_MY_PERMISSIONS_* cases in userAuthorizationReducer.
 */

import userAuthorizationReducer from "../../../redux/reducers/userAuthorizationReducer";
import { AUTH } from "../../../config/actions";

describe("userAuthorizationReducer — GET_MY_PERMISSIONS cases", () => {
  const initialState = userAuthorizationReducer(undefined, { type: "" });

  // ── Initial state ──────────────────────────────────────────────────────────

  it("has myPermissions: null and myPermissionsLoading: false in initial state", () => {
    expect(initialState.myPermissions).toBeNull();
    expect(initialState.myPermissionsLoading).toBe(false);
  });

  // ── REQUEST ───────────────────────────────────────────────────────────────

  it("sets myPermissionsLoading: true on GET_MY_PERMISSIONS_REQUEST", () => {
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.GET_MY_PERMISSIONS_REQUEST,
    });
    expect(state.myPermissionsLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.myPermissions).toBeNull(); // unchanged
  });

  // ── SUCCESS — real API shape ───────────────────────────────────────────────

  it("stores permissions array on GET_MY_PERMISSIONS_SUCCESS (real API shape)", () => {
    const mockApiResponse = {
      data: {
        flag: "success",
        message: "Permissions fetched",
        data: {
          permissions: [
            {
              project: "agent",
              modules: [
                {
                  module: "Rise Agent",
                  hasAccess: true,
                  permissions: [
                    { label: "Rise Agent : read",  hasAccess: true  },
                    { label: "Rise Agent : start", hasAccess: true  },
                    { label: "Rise Agent : stop",  hasAccess: false },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    // saga dispatches the full axios response as action.data
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.GET_MY_PERMISSIONS_SUCCESS,
      data: mockApiResponse,
    });

    expect(state.myPermissionsLoading).toBe(false);
    expect(Array.isArray(state.myPermissions)).toBe(true);
    expect(state.myPermissions).toHaveLength(1);
    expect((state.myPermissions as any[])[0].project).toBe("agent");
    expect((state.myPermissions as any[])[0].modules[0].permissions).toHaveLength(3);
  });

  it("stores empty array on GET_MY_PERMISSIONS_SUCCESS when no permissions key", () => {
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.GET_MY_PERMISSIONS_SUCCESS,
      data: { data: { data: {} } },
    });

    expect(state.myPermissionsLoading).toBe(false);
    expect(state.myPermissions).toEqual([]);
  });

  it("handles GET_MY_PERMISSIONS_SUCCESS with null fallback shape (saga null path)", () => {
    // saga sends { data: { data: { permissions: [] } } } as null fallback
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.GET_MY_PERMISSIONS_SUCCESS,
      data: { data: { data: { permissions: [] } } },
    });

    expect(state.myPermissionsLoading).toBe(false);
    expect(state.myPermissions).toEqual([]);
  });

  it("handles GET_MY_PERMISSIONS_SUCCESS with missing data gracefully", () => {
    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.GET_MY_PERMISSIONS_SUCCESS,
      data: undefined,
    });

    expect(state.myPermissionsLoading).toBe(false);
    expect(state.myPermissions).toEqual([]);
  });

  it("handles GET_MY_PERMISSIONS_SUCCESS with multiple projects", () => {
    const mockData = {
      data: {
        data: {
          permissions: [
            { project: "agent",   modules: [] },
            { project: "insight", modules: [] },
          ],
        },
      },
    };

    const state = userAuthorizationReducer(initialState, {
      type: AUTH.USER.GET_MY_PERMISSIONS_SUCCESS,
      data: mockData,
    });

    expect(state.myPermissions).toHaveLength(2);
    expect((state.myPermissions as any[])[0].project).toBe("agent");
    expect((state.myPermissions as any[])[1].project).toBe("insight");
  });

  // ── FAILURE ───────────────────────────────────────────────────────────────

  it("sets myPermissionsLoading: false and stores error on GET_MY_PERMISSIONS_FAILURE", () => {
    const loadingState = userAuthorizationReducer(initialState, {
      type: AUTH.USER.GET_MY_PERMISSIONS_REQUEST,
    });

    const state = userAuthorizationReducer(loadingState, {
      type: AUTH.USER.GET_MY_PERMISSIONS_FAILURE,
      error: "Network error",
    });

    expect(state.myPermissionsLoading).toBe(false);
    expect(state.error).toBe("Network error");
    expect(state.myPermissions).toBeNull(); // unchanged from before request
  });

  it("does not modify other state slices on permissions actions", () => {
    const withUsers = { ...initialState, users: [{ id: "u1" }] as any };

    const state = userAuthorizationReducer(withUsers, {
      type: AUTH.USER.GET_MY_PERMISSIONS_REQUEST,
    });

    expect(state.users).toEqual([{ id: "u1" }]);
    expect(state.loading).toBe(false); // main loading flag unchanged
  });
});
