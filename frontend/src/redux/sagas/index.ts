/**
 * Importing dependencies.
 */
import { fork, all, AllEffect, ForkEffect } from "redux-saga/effects";
import agentManagementSagas from "./agentManagementSagas";
import userAuthorizationSagaWatcher from "./userAuthorizationSagas";

// Exporting saga functions
export default function* sagas(): Generator<AllEffect<ForkEffect<void>>, void, unknown> {
  yield all([fork(agentManagementSagas), fork(userAuthorizationSagaWatcher)]);
}
