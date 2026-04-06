/**
 * fetchMyPermissionsSaga.test.tsx
 *
 * Tests for fetchMyPermissionsSaga in userAuthorizationSagas.
 */

import { call, put } from "redux-saga/effects";
import { AUTH } from "../../../config/actions";
import userAuthorizationActions from "../../../redux/actions/userAuthorization.action";
import permissionsService from "../../../services/auth/permissionsService";
import * as sagas from "../../../redux/sagas/userAuthorizationSagas";
import * as Toast from "../../../layouts/agent-management/helpers/CustomToast";

jest.mock("../../../services/auth/permissionsService");
jest.mock("../../../layouts/agent-management/helpers/CustomToast", () => ({
  successtoast: jest.fn(),
  errortoast: jest.fn(),
}));

const mockSuccessResponse = {
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
                { label: "Rise Agent : read",  hasAccess: true },
                { label: "Rise Agent : start", hasAccess: true },
              ],
            },
          ],
        },
      ],
    },
  },
};

describe("fetchMyPermissionsSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as any).location;
    (window as any).location = { href: "" };
  });

  // ── Happy path ─────────────────────────────────────────────────────────────

  it("calls permissionsService.fetchMyPermissions and dispatches success on valid response", () => {
    const generator = sagas.fetchMyPermissionsSaga();

    // Step 1: call the service
    const step1 = generator.next();
    expect(step1.value).toEqual(call(permissionsService.fetchMyPermissions));

    // Step 2: dispatch success with response
    const step2 = generator.next(mockSuccessResponse);
    expect(step2.value).toEqual(
      put(userAuthorizationActions.successFetchMyPermissions(mockSuccessResponse))
    );

    // Done
    const step3 = generator.next();
    expect(step3.done).toBe(true);
  });

  // ── Null response (session expired / network error) ────────────────────────

  it("returns early without dispatching when service returns null", () => {
    const generator = sagas.fetchMyPermissionsSaga();

    // Step 1: call service
    generator.next();

    // Step 2: service returns null → saga should stop
    const step2 = generator.next(null);
    expect(step2.done).toBe(true);
  });

  // ── Error path ─────────────────────────────────────────────────────────────

  it("dispatches failure action on unexpected error", () => {
    const generator = sagas.fetchMyPermissionsSaga();

    // Step 1: call service
    generator.next();

    // Simulate throw
    const error = { message: "Network error", response: { status: 500 } };
    const step2 = generator.throw(error);
    expect(step2.value).toEqual(
      put(userAuthorizationActions.failureFetchMyPermissions(error.message))
    );

    const step3 = generator.next();
    expect(step3.done).toBe(true);
  });

  it("redirects and stops on 401 error", () => {
    const generator = sagas.fetchMyPermissionsSaga();

    generator.next(); // call step

    const error = {
      message: "Unauthorized",
      response: { status: 401 },
    };

    const step2 = generator.throw(error);
    // Should return early (done) after redirect — no further put
    expect(step2.done).toBe(true);
    expect(window.location.href).toBe("/session-expired");
  });

  it("redirects and stops on Session Expired message", () => {
    const generator = sagas.fetchMyPermissionsSaga();

    generator.next();

    const error = {
      message: "Session Expired",
      response: { status: 200, data: { message: "Session Expired" } },
    };

    const step2 = generator.throw(error);
    expect(step2.done).toBe(true);
    expect(window.location.href).toBe("/session-expired");
  });
});
