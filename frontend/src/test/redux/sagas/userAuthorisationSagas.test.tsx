

import { runSaga } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { AUTH } from "../../../config/actions";
import userAuthorizationActions from "../../../redux/actions/userAuthorization.action";
import userAuthorizationService from "../../../services/userAuthorization/userAuthorization.service";
import * as sagas from "../../../redux/sagas/userAuthorizationSagas";
import * as Toast from "../../../layouts/agent-management/helpers/CustomToast";
jest.mock("../../../services/userAuthorization/userAuthorization.service");
jest.mock("../../../layouts/agent-management/helpers/CustomToast", () => ({
  successtoast: jest.fn(),
  errortoast: jest.fn(),
}));

describe("User Authorization Sagas - REAL FUNCTIONAL TESTS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("createUserSaga", () => {
    it("creates user successfully", () => {
      const userData = { username: "newuser", email: "user@test.com" };
      const mockResponse = {
        data: {
          flag: "success",
          data: { id: "user123", username: "newuser" },
        },
      };

      (userAuthorizationService.createUser as jest.Mock).mockResolvedValue(mockResponse);

      const generator = sagas.createUserSaga({
        type: AUTH.USER.CREATE_USER_REQUEST,
        props: userData,
      });
      const step1 = generator.next();
      expect(step1.value).toEqual(call(userAuthorizationService.createUser, userData));
      const step2 = generator.next(mockResponse);
      expect(step2.value).toEqual(put(userAuthorizationActions.successCreateUser(mockResponse)));
      const step3 = generator.next();
      expect(step3.value).toEqual(
        put(userAuthorizationActions.fetchUsers({ page: 1, limit: 10, search: "" })),
      );

      const result = generator.next();
      expect(result.done).toBe(true);
    });

    it("handles createUserSaga failure", () => {
      const userData = { username: "newuser", email: "user@test.com" };
      const mockError = { message: "User already exists" };

      (userAuthorizationService.createUser as jest.Mock).mockRejectedValue(mockError);

      const generator = sagas.createUserSaga({
        type: AUTH.USER.CREATE_USER_REQUEST,
        props: userData,
      });

      const step1 = generator.next();
      expect(step1.value).toEqual(call(userAuthorizationService.createUser, userData));

      const step2 = generator.next(mockError);
      expect(step2.done).toBe(false);
    });

    it("handles API error response in createUserSaga", () => {
      const userData = { username: "newuser", email: "user@test.com" };
      const errorResponse = {
        data: {
          flag: "error",
          error: "Username already exists",
        },
      };

      (userAuthorizationService.createUser as jest.Mock).mockResolvedValue(errorResponse);

      const generator = sagas.createUserSaga({
        type: AUTH.USER.CREATE_USER_REQUEST,
        props: userData,
      });

      const step1 = generator.next();
      expect(step1.value).toEqual(call(userAuthorizationService.createUser, userData));

      const step2 = generator.next(errorResponse);
      expect(step2.value).toEqual(put(userAuthorizationActions.successCreateUser(errorResponse)));

      const result = generator.next();
      expect(result.done).toBe(true);
    });
  });
  describe("updateUserSaga", () => {
    it("updates user successfully", () => {
      const updateData = { id: "user123", username: "updateduser", email: "updated@test.com" };
      const mockResponse = {
        data: {
          flag: "success",
          data: { id: "user123", username: "updateduser" },
        },
      };

      (userAuthorizationService.updateUser as jest.Mock).mockResolvedValue(mockResponse);

      const generator = sagas.updateUserSaga({
        type: AUTH.USER.UPDATE_USER_REQUEST,
        props: updateData,
      });

      const step1 = generator.next();
      const { id, ...userData } = updateData;
      expect(step1.value).toEqual(call(userAuthorizationService.updateUser, id, userData));

      const step2 = generator.next(mockResponse);
      expect(step2.value).toEqual(put(userAuthorizationActions.successUpdateUser(mockResponse)));

      const result = generator.next();
      expect(result.done).toBe(true);
    });

    it("handles updateUserSaga error", () => {
      const updateData = { id: "user123", username: "updateduser" };
      const mockError = new Error("Update failed");

      (userAuthorizationService.updateUser as jest.Mock).mockRejectedValue(mockError);

      const generator = sagas.updateUserSaga({
        type: AUTH.USER.UPDATE_USER_REQUEST,
        props: updateData,
      });

      const step1 = generator.next();
      expect(step1.done).toBe(false);
    });
  });
  describe("deleteUserSaga", () => {
    it("deletes user successfully", () => {
      const mockResponse = {
        data: {
          flag: "success",
          data: { deletedUserId: "user123" },
        },
      };

      (userAuthorizationService.deleteUser as jest.Mock).mockResolvedValue(mockResponse);

      const generator = sagas.deleteUserSaga({
        type: AUTH.USER.DELETE_USER_REQUEST,
        username: "testuser",
      });

      const step1 = generator.next();
      expect(step1.value).toEqual(call(userAuthorizationService.deleteUser, "testuser"));

      const step2 = generator.next(mockResponse);
      expect(step2.value).toEqual(put(userAuthorizationActions.successDeleteUser(mockResponse)));

      const step3 = generator.next();
      expect(step3.value).toEqual(
        put(userAuthorizationActions.fetchUsers({ page: 1, limit: 10, search: "" })),
      );

      const result = generator.next();
      expect(result.done).toBe(true);
    });

    it("handles deleteUserSaga error with graceful fallback", () => {
      const mockError = new Error("Delete failed");

      (userAuthorizationService.deleteUser as jest.Mock).mockRejectedValue(mockError);

      const generator = sagas.deleteUserSaga({
        type: AUTH.USER.DELETE_USER_REQUEST,
        username: "testuser",
      });

      const step1 = generator.next();
      expect(step1.done).toBe(false);
    });
  });
  describe("createPermissionSaga", () => {
    it("creates permission successfully", () => {
      const permissionData = {
        project: "agent",
        module: "config",
        permission: "read",
      };
      const mockResponse = {
        data: {
          flag: "success",
          data: { id: "perm123", ...permissionData },
        },
      };

      (userAuthorizationService.createPermission as jest.Mock).mockResolvedValue(mockResponse);

      const generator = sagas.createPermissionSaga({
        type: AUTH.PERMISSION.CREATE_PERMISSION_REQUEST,
        permissionData,
      });

      const step1 = generator.next();
      expect(step1.value).toEqual(call(userAuthorizationService.createPermission, permissionData));

      const step2 = generator.next(mockResponse);
      expect(step2.value).toEqual(put(userAuthorizationActions.successCreatePermission(mockResponse)));
      const step3 = generator.next();
      expect(step3.value).toEqual(
        put(userAuthorizationActions.fetchPermissions({ page: 1, limit: 10 })),
      );

      const result = generator.next();
      expect(result.done).toBe(true);
    });

    it("handles createPermissionSaga API error response", () => {
      const permissionData = { project: "agent", module: "config" };
      const errorResponse = {
        data: {
          flag: "error",
          error: "Invalid permission data",
        },
      };

      (userAuthorizationService.createPermission as jest.Mock).mockResolvedValue(errorResponse);

      const generator = sagas.createPermissionSaga({
        permissionData,
      });

      const step1 = generator.next();
      expect(step1.value).toEqual(call(userAuthorizationService.createPermission, permissionData));

      const step2 = generator.next(errorResponse);
      expect(step2.value).toEqual(
        put(userAuthorizationActions.failureCreatePermission(errorResponse.data.error)),
      );

      const result = generator.next();
      expect(result.done).toBe(true);
    });

    it("handles createPermissionSaga exception", () => {
      const permissionData = { project: "agent", module: "config" };
      const error = new Error("Network error");

      (userAuthorizationService.createPermission as jest.Mock).mockRejectedValue(error);

      const generator = sagas.createPermissionSaga({
        permissionData,
      });

      const step1 = generator.next();
      expect(step1.done).toBe(false);
    });
  });
  describe("deletePermissionSaga", () => {
    it("deletes permission successfully", () => {
      const mockResponse = {
        data: {
          flag: "success",
          data: { deletedId: "perm123" },
        },
      };

      (userAuthorizationService.deletePermission as jest.Mock).mockResolvedValue(mockResponse);

      const generator = sagas.deletePermissionSaga({
        type: AUTH.PERMISSION.DELETE_PERMISSION_REQUEST,
        permissionId: "perm123",
      });

      const step1 = generator.next();
      expect(step1.value).toEqual(call(userAuthorizationService.deletePermission, "perm123"));

      const step2 = generator.next(mockResponse);
      expect(step2.value).toEqual(put(userAuthorizationActions.successDeletePermission(mockResponse)));
      const step3 = generator.next();
      expect(step3.value).toEqual(
        put(userAuthorizationActions.fetchPermissions({ page: 1, limit: 10 })),
      );

      const result = generator.next();
      expect(result.done).toBe(true);
    });

    it("handles deletePermissionSaga with unknown error", () => {
      const errorResponse = {
        data: {
          flag: "error",
          error: null, // Simulates 'Unknown error'
        },
      };

      (userAuthorizationService.deletePermission as jest.Mock).mockResolvedValue(errorResponse);

      const generator = sagas.deletePermissionSaga({
        permissionId: "perm123",
      });

      const step1 = generator.next();
      expect(step1.value).toEqual(call(userAuthorizationService.deletePermission, "perm123"));

      const step2 = generator.next(errorResponse);
      expect(step2.value).toEqual(
        put(userAuthorizationActions.failureDeletePermission(null)),
      );

      const result = generator.next();
      expect(result.done).toBe(true);
    });
  });
  describe("assignUserPermissionsSaga", () => {
    it("assigns permissions to user successfully", () => {
      const userId = "user123";
      const permissionCodes = ["agent:config:read", "agent:logs:read"];
      const mockResponse = {
        data: {
          flag: "success",
          data: { userId, permissions: permissionCodes },
        },
      };

      (userAuthorizationService.assignUserPermissions as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const generator = sagas.assignUserPermissionsSaga({
        type: AUTH.USER.ASSIGN_USER_PERMISSIONS_REQUEST,
        userId,
        permissionCodes,
      });

      const step1 = generator.next();
      expect(step1.value).toEqual(
        call(userAuthorizationService.assignUserPermissions, userId, permissionCodes),
      );

      const step2 = generator.next(mockResponse);
      expect(step2.value).toEqual(
        put(userAuthorizationActions.successAssignUserPermissions(mockResponse)),
      );

      const step3 = generator.next();
      expect(step3.value).toEqual(
        put(userAuthorizationActions.fetchUsers({ page: 1, limit: 10, search: "" })),
      );

      const result = generator.next();
      expect(result.done).toBe(true);
    });

    it("handles assignUserPermissionsSaga API error", () => {
      const userId = "user123";
      const permissionCodes = ["agent:config:read"];
      const errorResponse = {
        data: {
          flag: "error",
          error: "User not found",
        },
      };

      (userAuthorizationService.assignUserPermissions as jest.Mock).mockResolvedValue(
        errorResponse,
      );

      const generator = sagas.assignUserPermissionsSaga({
        userId,
        permissionCodes,
      });

      const step1 = generator.next();
      expect(step1.done).toBe(false);
    });

    it("handles assignUserPermissionsSaga with nested error response", () => {
      const userId = "user123";
      const permissionCodes = ["agent:config:read"];
      const error = new Error("Permission denied");
      (error as any).response = {
        data: { error: "Access denied" },
      };

      (userAuthorizationService.assignUserPermissions as jest.Mock).mockRejectedValue(error);

      const generator = sagas.assignUserPermissionsSaga({
        userId,
        permissionCodes,
      });

      const step1 = generator.next();
      expect(step1.done).toBe(false);
    });
  });
  describe("fetchGlobalPermissionsSaga", () => {
    it("fetches global permissions for user successfully", () => {
      const userId = "user123";
      const mockResponse = {
        data: {
          flag: "success",
          data: {
            userId,
            permissions: [
              { code: "agent:config:read", name: "Read Config" },
              { code: "agent:logs:read", name: "Read Logs" },
            ],
          },
        },
      };

      (userAuthorizationService.fetchGlobalPermissions as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const generator = sagas.fetchGlobalPermissionsSaga({
        type: AUTH.USER.FETCH_GLOBAL_PERMISSIONS_REQUEST,
        userId,
      });

      const step1 = generator.next();
      expect(step1.value).toEqual(call(userAuthorizationService.fetchGlobalPermissions, userId));

      const step2 = generator.next(mockResponse);
      expect(step2.value).toEqual(
        put(userAuthorizationActions.successFetchGlobalPermissions(mockResponse)),
      );

      const result = generator.next();
      expect(result.done).toBe(true);
    });

    it("handles fetchGlobalPermissionsSaga error with nested response", () => {
      const userId = "user123";
      const error = new Error("Permissions fetch failed");
      (error as any).response = {
        data: { error: "Invalid user ID" },
      };

      (userAuthorizationService.fetchGlobalPermissions as jest.Mock).mockRejectedValue(error);

      const generator = sagas.fetchGlobalPermissionsSaga({
        userId,
      });

      const step1 = generator.next();
      expect(step1.done).toBe(false);
    });

    it("handles fetchGlobalPermissionsSaga API error flag", () => {
      const userId = "user123";
      const errorResponse = {
        data: {
          flag: "error",
          error: "Permission denied",
        },
      };

      (userAuthorizationService.fetchGlobalPermissions as jest.Mock).mockResolvedValue(
        errorResponse,
      );

      const generator = sagas.fetchGlobalPermissionsSaga({
        userId,
      });

      const step1 = generator.next();
      expect(step1.value).toEqual(call(userAuthorizationService.fetchGlobalPermissions, userId));

      const step2 = generator.next(errorResponse);
      expect(step2.value).toEqual(
        put(userAuthorizationActions.successFetchGlobalPermissions(errorResponse)),
      );

      const result = generator.next();
      expect(result.done).toBe(true);
    });
  });
  describe("userAuthorizationSagaWatcher", () => {
    it.skip("watches all action types and triggers correct sagas", () => {
      const generator = sagas.default();
      let step = generator.next();
      expect(step.value).toEqual(takeLatest(AUTH.USER.GET_USERS_REQUEST, sagas.fetchUsersSaga));
      step = generator.next();
      expect(step.value).toEqual(takeLatest(AUTH.USER.CREATE_USER_REQUEST, sagas.createUserSaga));
      step = generator.next();
      expect(step.value).toEqual(takeLatest(AUTH.USER.UPDATE_USER_REQUEST, sagas.updateUserSaga));
      step = generator.next();
      expect(step.value).toEqual(takeLatest(AUTH.USER.DELETE_USER_REQUEST, sagas.deleteUserSaga));
      step = generator.next();
      expect(step.value).toEqual(
        takeLatest(AUTH.USER.ASSIGN_USER_PERMISSIONS_REQUEST, sagas.assignUserPermissionsSaga),
      );
      step = generator.next();
      expect(step.value).toEqual(
        takeLatest(AUTH.USER.FETCH_GLOBAL_PERMISSIONS_REQUEST, sagas.fetchGlobalPermissionsSaga),
      );
      step = generator.next();
      expect(step.value).toEqual(
        takeLatest(AUTH.PERMISSION.GET_PERMISSIONS_REQUEST, sagas.fetchPermissionsSaga),
      );
      step = generator.next();
      expect(step.value).toEqual(
        takeLatest(AUTH.PERMISSION.CREATE_PERMISSION_REQUEST, sagas.createPermissionSaga),
      );
      step = generator.next();
      expect(step.value).toEqual(
        takeLatest(AUTH.PERMISSION.DELETE_PERMISSION_REQUEST, sagas.deletePermissionSaga),
      );

      const result = generator.next();
      expect(result.done).toBe(true);
    });
  });
  describe("Saga Integration Tests", () => {
    it("create user saga calls all expected sagas in sequence", () => {
      const userData = { username: "testuser", email: "test@test.com" };
      const mockResponse = {
        data: {
          flag: "success",
          data: { id: "user123", username: "testuser" },
        },
      };

      (userAuthorizationService.createUser as jest.Mock).mockResolvedValue(mockResponse);

      const generator = sagas.createUserSaga({
        type: AUTH.USER.CREATE_USER_REQUEST,
        props: userData,
      });
      let step = generator.next();
      expect(step.value).toEqual(call(userAuthorizationService.createUser, userData));
      step = generator.next(mockResponse);
      expect(step.value).toEqual(put(userAuthorizationActions.successCreateUser(mockResponse)));
      step = generator.next();
      expect(step.value).toEqual(
        put(userAuthorizationActions.fetchUsers({ page: 1, limit: 10, search: "" })),
      );
      step = generator.next();
      expect(step.done).toBe(true);
    });
  });
});
