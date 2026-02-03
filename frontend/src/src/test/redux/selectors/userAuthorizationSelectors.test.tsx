import * as selectors from "../../../redux/selectors/userAuthorization.selectors";

describe("User Authorization Selectors - REAL FUNCTIONAL TESTS", () => {
  const mockState = {
    userAuthorization: {
      users: [
        { id: "user1", userName: "testuser1", isActive: true, rolesCount: 2 },
        { id: "user2", userName: "testuser2", isActive: false, rolesCount: 1 },
      ],
      loading: false,
      error: null,
      pagination: { page: 1, limit: 10, total: 2 },
      selectedUsers: ["user1"],
      permissions: [
        { id: "perm1", code: "agent:config:read" },
        { id: "perm2", code: "agent:logs:read" },
      ],
      userPermissions: [{ code: "agent:config:read", name: "Read Config" }],
      permissionsPagination: { page: 1, limit: 10, total: 2 },
      globalPermissions: null,
    },
  };

  describe("getUsers", () => {
    it("returns users list from state", () => {
      const users = selectors.getUsers(mockState);
      expect(users).toHaveLength(2);
      expect(users[0].id).toBe("user1");
      expect(users[1].id).toBe("user2");
    });

    it("returns empty array when users is undefined", () => {
      const state = { userAuthorization: {} };
      const users = selectors.getUsers(state);
      expect(users).toEqual([]);
    });

    it("returns empty array when userAuthorization is undefined", () => {
      const state = {};
      const users = selectors.getUsers(state);
      expect(users).toEqual([]);
    });
  });

  describe("isUsersLoading", () => {
    it("returns loading state when true", () => {
      const state = { userAuthorization: { loading: true } };
      const isLoading = selectors.isUsersLoading(state);
      expect(isLoading).toBe(true);
    });

    it("returns loading state when false", () => {
      const isLoading = selectors.isUsersLoading(mockState);
      expect(isLoading).toBe(false);
    });

    it("returns false when loading is undefined", () => {
      const state = { userAuthorization: {} };
      const isLoading = selectors.isUsersLoading(state);
      expect(isLoading).toBe(false);
    });
  });

  describe("getUsersError", () => {
    it("returns error state when present", () => {
      const errorMessage = "Failed to fetch users";
      const state = { userAuthorization: { error: errorMessage } };
      const error = selectors.getUsersError(state);
      expect(error).toBe(errorMessage);
    });

    it("returns null when no error", () => {
      const error = selectors.getUsersError(mockState);
      expect(error).toBeNull();
    });

    it("returns null when error is undefined", () => {
      const state = { userAuthorization: {} };
      const error = selectors.getUsersError(state);
      expect(error).toBeNull();
    });
  });

  describe("getUsersPagination", () => {
    it("returns pagination data from state", () => {
      const pagination = selectors.getUsersPagination(mockState);
      expect(pagination.page).toBe(1);
      expect(pagination.limit).toBe(10);
      expect(pagination.total).toBe(2);
    });

    it("returns default pagination when undefined", () => {
      const state = { userAuthorization: {} };
      const pagination = selectors.getUsersPagination(state);
      expect(pagination.page).toBe(1);
      expect(pagination.limit).toBe(10);
      expect(pagination.total).toBe(0);
    });

    it("uses different pagination values", () => {
      const state = {
        userAuthorization: {
          pagination: { page: 5, limit: 20, total: 100 },
        },
      };
      const pagination = selectors.getUsersPagination(state);
      expect(pagination.page).toBe(5);
      expect(pagination.limit).toBe(20);
      expect(pagination.total).toBe(100);
    });
  });

  describe("getSelectedUsers", () => {
    it("returns selected users list", () => {
      const selected = selectors.getSelectedUsers(mockState);
      expect(selected).toEqual(["user1"]);
    });

    it("returns empty array when no users selected", () => {
      const state = { userAuthorization: { selectedUsers: [] } };
      const selected = selectors.getSelectedUsers(state);
      expect(selected).toEqual([]);
    });

    it("returns empty array when selectedUsers is undefined", () => {
      const state = { userAuthorization: {} };
      const selected = selectors.getSelectedUsers(state);
      expect(selected).toEqual([]);
    });

    it("handles multiple selected users", () => {
      const state = {
        userAuthorization: { selectedUsers: ["user1", "user2", "user3"] },
      };
      const selected = selectors.getSelectedUsers(state);
      expect(selected).toHaveLength(3);
    });
  });

  describe("getSelectedUsersCount", () => {
    it("returns count of selected users", () => {
      const count = selectors.getSelectedUsersCount(mockState);
      expect(count).toBe(1);
    });

    it("returns 0 when no users selected", () => {
      const state = { userAuthorization: { selectedUsers: [] } };
      const count = selectors.getSelectedUsersCount(state);
      expect(count).toBe(0);
    });

    it("returns correct count for multiple selected users", () => {
      const state = {
        userAuthorization: { selectedUsers: ["user1", "user2", "user3"] },
      };
      const count = selectors.getSelectedUsersCount(state);
      expect(count).toBe(3);
    });
  });

  describe("getUserPermissions", () => {
    it("returns user permissions list", () => {
      const userPerms = selectors.getUserPermissions(mockState);
      expect(userPerms).toHaveLength(1);
      expect(userPerms[0].code).toBe("agent:config:read");
    });

    it("returns empty array when undefined", () => {
      const state = { userAuthorization: {} };
      const userPerms = selectors.getUserPermissions(state);
      expect(userPerms).toEqual([]);
    });

    it("handles multiple user permissions", () => {
      const state = {
        userAuthorization: {
          userPermissions: [
            { code: "perm1", name: "Permission 1" },
            { code: "perm2", name: "Permission 2" },
            { code: "perm3", name: "Permission 3" },
          ],
        },
      };
      const userPerms = selectors.getUserPermissions(state);
      expect(userPerms).toHaveLength(3);
    });
  });

  describe("getPermissions", () => {
    it("returns permissions list from state", () => {
      const permissions = selectors.getPermissions(mockState);
      expect(permissions).toHaveLength(2);
      expect(permissions[0].code).toBe("agent:config:read");
    });

    it("returns empty array when permissions is undefined", () => {
      const state = { userAuthorization: {} };
      const permissions = selectors.getPermissions(state);
      expect(permissions).toEqual([]);
    });

    it("handles various permission objects", () => {
      const state = {
        userAuthorization: {
          permissions: [
            { id: "1", code: "read", name: "Read", project: "agent", module: "config" },
            { id: "2", code: "write", name: "Write", project: "agent", module: "config" },
            { id: "3", code: "delete", name: "Delete", project: "agent", module: "logs" },
          ],
        },
      };
      const permissions = selectors.getPermissions(state);
      expect(permissions).toHaveLength(3);
      expect(permissions[2].module).toBe("logs");
    });
  });

  describe("getPermissionsPagination", () => {
    it("returns permissions pagination data", () => {
      const pagination = selectors.getPermissionsPagination(mockState);
      expect(pagination.page).toBe(1);
      expect(pagination.limit).toBe(10);
      expect(pagination.total).toBe(2);
    });

    it("returns default pagination when undefined", () => {
      const state = { userAuthorization: {} };
      const pagination = selectors.getPermissionsPagination(state);
      expect(pagination.page).toBe(1);
      expect(pagination.limit).toBe(10);
      expect(pagination.total).toBe(0);
    });

    it("uses different pagination values", () => {
      const state = {
        userAuthorization: {
          permissionsPagination: { page: 3, limit: 15, total: 45 },
        },
      };
      const pagination = selectors.getPermissionsPagination(state);
      expect(pagination.page).toBe(3);
      expect(pagination.limit).toBe(15);
      expect(pagination.total).toBe(45);
    });
  });

  describe("isUserSelected", () => {
    it("returns true when user is selected", () => {
      const isSelected = selectors.isUserSelected(mockState, "user1");
      expect(isSelected).toBe(true);
    });

    it("returns false when user is not selected", () => {
      const isSelected = selectors.isUserSelected(mockState, "user2");
      expect(isSelected).toBe(false);
    });

    it("returns false when selectedUsers is empty", () => {
      const state = { userAuthorization: { selectedUsers: [] } };
      const isSelected = selectors.isUserSelected(state, "user1");
      expect(isSelected).toBe(false);
    });

    it("handles check for non-existent user", () => {
      const isSelected = selectors.isUserSelected(mockState, "nonexistent");
      expect(isSelected).toBe(false);
    });

    it("handles multiple selected users correctly", () => {
      const state = {
        userAuthorization: { selectedUsers: ["user1", "user2", "user3"] },
      };
      expect(selectors.isUserSelected(state, "user1")).toBe(true);
      expect(selectors.isUserSelected(state, "user2")).toBe(true);
      expect(selectors.isUserSelected(state, "user3")).toBe(true);
      expect(selectors.isUserSelected(state, "user4")).toBe(false);
    });
  });

  describe("Selector Memoization", () => {
    it("getUsers returns same reference for identical state", () => {
      const result1 = selectors.getUsers(mockState);
      const result2 = selectors.getUsers(mockState);
      expect(result1).toBe(result2);
    });

    it("getPermissions returns same reference for identical state", () => {
      const result1 = selectors.getPermissions(mockState);
      const result2 = selectors.getPermissions(mockState);
      expect(result1).toBe(result2);
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined userAuthorization state gracefully", () => {
      const state = {};
      expect(selectors.getUsers(state)).toEqual([]);
      expect(selectors.isUsersLoading(state)).toBe(false);
      expect(selectors.getUsersError(state)).toBeNull();
      expect(selectors.getSelectedUsers(state)).toEqual([]);
    });

    it("handles null values in arrays", () => {
      const state = {
        userAuthorization: {
          selectedUsers: ["user1", null, "user2"],
        },
      };
      const selected = selectors.getSelectedUsers(state);
      expect(selected).toHaveLength(3);
      expect(selected.includes("user1")).toBe(true);
    });

    it("handles mixed selector types", () => {
      const users = selectors.getUsers(mockState);
      const isLoading = selectors.isUsersLoading(mockState);
      const selectedCount = selectors.getSelectedUsersCount(mockState);

      expect(users.length).toBeGreaterThan(0);
      expect(typeof isLoading).toBe("boolean");
      expect(typeof selectedCount).toBe("number");
    });
  });

  describe("Selector Composition", () => {
    it("can use multiple selectors together", () => {
      const users = selectors.getUsers(mockState);
      const pagination = selectors.getUsersPagination(mockState);
      const selectedCount = selectors.getSelectedUsersCount(mockState);

      expect(users.length).toBeLessThanOrEqual(pagination.limit);
      expect(selectedCount).toBeLessThanOrEqual(users.length);
    });

    it("tracks state changes across multiple selectors", () => {
      const initialState = {
        userAuthorization: {
          users: [{ id: "u1" }],
          selectedUsers: [],
          pagination: { page: 1, limit: 10, total: 1 },
        },
      };

      const users = selectors.getUsers(initialState);
      const selected = selectors.getSelectedUsers(initialState);
      const pagination = selectors.getUsersPagination(initialState);

      expect(users).toHaveLength(1);
      expect(selected).toHaveLength(0);
      expect(pagination.total).toBe(1);
    });
  });
});
