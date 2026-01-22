import { call, put, takeLatest } from "redux-saga/effects";
import { get } from "lodash";
import { AUTH } from "../../config/actions";
import userAuthorizationActions from "../actions/userAuthorization.action";
import userAuthorizationService from "../../services/userAuthorization/userAuthorization.service";
import { successtoast, errortoast } from "../../layouts/agent-management/helpers/CustomToast";

interface ActionProps {
  type: string;
  props?: any;
  userId?: string;
  username?:string;
}


export function* fetchUsersSaga({ props }: ActionProps): Generator<any, void, any> {
  try {
    const output = yield call(userAuthorizationService.fetchUsers, props);
    yield put(userAuthorizationActions.successFetchUsers(output));

    if (get(output, "data.flag") !== "success") {
      errortoast(`Failed to load users: ${output.data.error}`);
    }
  } catch (error: any) {
    yield put(userAuthorizationActions.failureFetchUsers(error));
    errortoast(`Failed to load users: ${error.message}`);
  }
}


export function* createUserSaga({ props }: ActionProps): Generator<any, void, any> {
  try {
    const output = yield call(userAuthorizationService.createUser, props);
    yield put(userAuthorizationActions.successCreateUser(output));

    if (get(output, "data.flag") === "success") {
      successtoast("User created successfully");
      yield put(userAuthorizationActions.fetchUsers({ page: 1, limit: 10, search: "" }));
    } else {
      errortoast(`Failed to create user: ${output.data.error}`);
    }
  } catch (error: any) {
    yield put(userAuthorizationActions.failureCreateUser(error));
    errortoast(`Failed to create user: ${error.message}`);
  }
}


export function* updateUserSaga({ props }: ActionProps): Generator<any, void, any> {
  try {
    const { id, ...userData } = props;
    const output = yield call(userAuthorizationService.updateUser, id, userData);
    yield put(userAuthorizationActions.successUpdateUser(output));

    if (get(output, "data.flag") === "success") {
      successtoast("User updated successfully");
    } else {
      errortoast(`Failed to update user: ${output.data.error}`);
    }
  } catch (error: any) {
    yield put(userAuthorizationActions.failureUpdateUser(error));
    errortoast(`Failed to update user: ${error.message}`);
  }
}


export function* deleteUserSaga({ username }: ActionProps): Generator<any, void, any> {
  try {
    const output = yield call(userAuthorizationService.deleteUser, username);
    yield put(userAuthorizationActions.successDeleteUser(output));

    if (get(output, "data.flag") === "success") {
      successtoast("User deleted successfully");
      yield put(userAuthorizationActions.fetchUsers({ page: 1, limit: 10, search: "" }));
    } else {
      errortoast(`Failed to delete user: ${output.data.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    yield put(userAuthorizationActions.failureDeleteUser(error));
    console.log(error)
    errortoast(`Failed to delete user: ${error.message}`);
  }
}



export function* fetchPermissionsSaga(action: any): Generator<any, void, any> {
  try {
    console.log("Fetch Permissions Saga - Filters:", action.filters);
    const output = yield call(userAuthorizationService.fetchPermissions, action.filters);
    console.log("Fetch Permissions Response:", output);
    
    if (output.data.flag === "success") {
      yield put(userAuthorizationActions.successFetchPermissions(output));
    } else {
      yield put(userAuthorizationActions.failureFetchPermissions(output.data.error));
    }
  } catch (error: any) {
    console.error("Fetch Permissions Error:", error);
    yield put(userAuthorizationActions.failureFetchPermissions(error.message));
  }
}


export function* createPermissionSaga({ permissionData }: any): Generator<any, void, any> {
  try {
    const output = yield call(userAuthorizationService.createPermission, permissionData);
    
    if (output.data.flag === "success") {
      successtoast("Permission created successfully!");
      yield put(userAuthorizationActions.successCreatePermission(output));
      yield put(userAuthorizationActions.fetchPermissions({ page: 1, limit: 10 }));
    } else {
      errortoast(`Failed to create permission: ${output.data.error}`);
      yield put(userAuthorizationActions.failureCreatePermission(output.data.error));
    }
  } catch (error: any) {
    errortoast("Error creating permission");
    yield put(userAuthorizationActions.failureCreatePermission(error.message));
  }
}


export function* deletePermissionSaga({ permissionId }: any): Generator<any, void, any> {
  try {
    const output = yield call(userAuthorizationService.deletePermission, permissionId);
    
    if (output.data.flag === "success") {
      successtoast("Permission deleted successfully!");
      yield put(userAuthorizationActions.successDeletePermission(output));
      yield put(userAuthorizationActions.fetchPermissions({ page: 1, limit: 10 }));
    } else {
      errortoast(`Failed to delete permission: ${output.data.error || 'Unknown error'}`);
      yield put(userAuthorizationActions.failureDeletePermission(output.data.error));
    }
  } catch (error: any) {
    errortoast("Error deleting permission");
    yield put(userAuthorizationActions.failureDeletePermission(error.message));
  }
}


export function* assignUserPermissionsSaga({ userId, permissionCodes }: any): Generator<any, void, any> {
  try {
    console.log("Assign Permissions Saga - userId:", userId, "codes:", permissionCodes);
    const output = yield call(userAuthorizationService.assignUserPermissions, userId, permissionCodes);
    console.log("Assign Permissions Response:", output);
    
    yield put(userAuthorizationActions.successAssignUserPermissions(output));

    if (get(output, "data.flag") === "success") {
      successtoast("Permissions assigned successfully!");
      yield put(userAuthorizationActions.fetchUsers({ page: 1, limit: 10, search: "" }));
    } else {
      errortoast(`Failed to assign permissions: ${output.data.error}`);
    }
  } catch (error: any) {
    console.error("Assign Permissions Error:", error);
    yield put(userAuthorizationActions.failureAssignUserPermissions(error));
    errortoast(`Failed to assign permissions: ${error.response?.data?.error || error.message}`);
  }
}


export function* fetchGlobalPermissionsSaga({ userId }: any): Generator<any, void, any> {
  try {
    console.log("Fetch Global Permissions Saga - userId:", userId);
    const output = yield call(userAuthorizationService.fetchGlobalPermissions, userId);
    console.log("Fetch Global Permissions Response:", output);
    
    yield put(userAuthorizationActions.successFetchGlobalPermissions(output));

    if (get(output, "data.flag") !== "success") {
      errortoast(`Failed to load permissions: ${output.data.error}`);
    }
  } catch (error: any) {
    console.error("Fetch Global Permissions Error:", error);
    yield put(userAuthorizationActions.failureFetchGlobalPermissions(error));
    errortoast(`Failed to load permissions: ${error.response?.data?.error || error.message}`);
  }
}


export default function* userAuthorizationSagaWatcher(): Generator<any, void, any> {
  yield takeLatest(AUTH.USER.GET_USERS_REQUEST, fetchUsersSaga);
  yield takeLatest(AUTH.USER.CREATE_USER_REQUEST, createUserSaga);
  yield takeLatest(AUTH.USER.UPDATE_USER_REQUEST, updateUserSaga);
  yield takeLatest(AUTH.USER.DELETE_USER_REQUEST, deleteUserSaga);
  yield takeLatest(AUTH.USER.ASSIGN_USER_PERMISSIONS_REQUEST, assignUserPermissionsSaga);
  yield takeLatest(AUTH.USER.FETCH_GLOBAL_PERMISSIONS_REQUEST, fetchGlobalPermissionsSaga);
  yield takeLatest(AUTH.PERMISSION.GET_PERMISSIONS_REQUEST, fetchPermissionsSaga);
  yield takeLatest(AUTH.PERMISSION.CREATE_PERMISSION_REQUEST, createPermissionSaga);
  yield takeLatest(AUTH.PERMISSION.DELETE_PERMISSION_REQUEST, deletePermissionSaga);
}

