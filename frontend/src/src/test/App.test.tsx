import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import initializeStore from "../redux/initializeStore";
import App from "../App";
jest.mock("../layouts/agent-management/AgentManagement.tsx", () => () => <div data-testid="agent-management">AgentManagement</div>);
jest.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container">ToastContainer</div>,
}));
jest.mock("../redux/initializeStore.ts", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getState: jest.fn(),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  })),
}));

describe("App Component", () => {
  beforeEach(() => {
    (initializeStore as jest.Mock).mockClear();
  });

  it("renders without crashing", () => {
    render(
      <Provider store={initializeStore()}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </Provider>,
    );
  });

  it("initializes the redux store", () => {
    render(
      <Provider store={initializeStore()}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>,
    );
    expect(initializeStore).toHaveBeenCalledTimes(2);
  });
});