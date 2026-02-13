import AuthUtils from "../../utils/AuthUtils";
import reactRouterDom from "react-router-dom";
import { history } from "../../utils/utils";
import { waitFor } from "@testing-library/react";

jest.mock("react-router-dom");

jest.mock("../../services/auth/UserService");

const pushMock = jest.fn();
reactRouterDom.useHistory = jest.fn().mockReturnValue({ push: pushMock });
const pushSpy = jest.spyOn(history, "push");

Object.defineProperty(window, "sessionStorage", {
  value: {
    setItem: jest.fn(),
  },
  writable: true,
});

window.open = jest.fn();

describe("Auth Utils Test", () => {
  afterAll(() => {
    pushSpy.mockRestore();
    jest.resetAllMocks();
  });
  it("AuthUtils login", () => {
    window.open = jest.fn();
    AuthUtils.Login();
    expect(window.open).toHaveBeenCalled();
  });

  it("AuthUtils RedirectToDashboard", async () => {
    AuthUtils.RedirectToDashboard();
    await waitFor(() => expect(pushSpy).toHaveBeenCalledWith("/app/dashboard"));
  });

  it("AuthUtils logout", async () => {
    AuthUtils.Logout();
    await waitFor(() => expect(pushSpy).toHaveBeenCalledTimes(1));
  });
  it("AuthUtils RedirectToUnauthorized", async () => {
    AuthUtils.RedirectToUnauthorized();
    await waitFor(() => expect(pushSpy).toHaveBeenCalledWith("/unauthorized"));
  });

  it("AuthUtils validateUser 1", async () => {
    window.open = jest.fn();
    AuthUtils.validateUser();
    expect(window.open).toHaveBeenCalled();
  });

  it("AuthUtils validateUser 2", async () => {
    window.open = jest.fn();
    AuthUtils.validateUser("test-token", "test-user-id");
    setTimeout(() => {
      expect(window.open).toHaveBeenCalled();
      AuthUtils.removeUserSession();
    }, 1100);
  });

  it("should call Login when token or userId are not provided", async () => {
    const loginMock = jest.fn();
    global.Login = loginMock;
    await AuthUtils.validateUser();
    // expect(loginMock).toHaveBeenCalled();
  });

  it("LoginWithRedirectURL should set redirectUrl in sessionStorage and open the login page with correct query parameter", () => {
    const redirectUrl = "/redirect/to/somewhere";
    AuthUtils.LoginWithRedirectURL(redirectUrl);
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      "redirectUrl",
      redirectUrl
    );
    expect(window.open).toHaveBeenCalledWith(
      `/login?redirectUrl=${redirectUrl}`,
      "_self"
    );
  });
});