import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";

import { useDispatch } from "react-redux";
import AgentManagement from "../../../layouts/agent-management/AgentManagement";
import userAuthorizationActions from "../../../redux/actions/userAuthorization.action";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn().mockImplementation((fn: any) => fn({})),
}));

describe("AgentManagement permission flow", () => {
  it("dispatches fetchMyPermissions on mount", () => {
    const mockDispatch = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

    render(<AgentManagement />);

    const found = mockDispatch.mock.calls.some(c => c[0]?.type === userAuthorizationActions.fetchMyPermissions().type);
    expect(found).toBe(true);
  });
});
