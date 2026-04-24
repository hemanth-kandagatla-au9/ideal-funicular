import { fork, all, AllEffect, ForkEffect } from "redux-saga/effects";
import agentManagementSagas from "./agentManagementSagas";
import userAuthorizationSagaWatcher from "./userAuthorizationSagas";
import bulkActionLogsSagas from "./bulkActionLogsSagas";

export default function* sagas(): Generator<AllEffect<ForkEffect<void>>, void, unknown> {
  yield all([fork(agentManagementSagas), fork(userAuthorizationSagaWatcher), fork(bulkActionLogsSagas)]);
}
