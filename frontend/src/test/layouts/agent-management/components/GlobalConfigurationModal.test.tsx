import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GlobalConfigurationModal from "../../../../../src/layouts/agent-management/components/GlobalConfigurationModal";

import agentManagementAction from "@/redux/actions/agentManagement.action";
import {
  getAgentGlobalConfig,
  isGlobalConfigLoading,
} from "@/redux/selectors/agentManagement.selectors";

// mock constants
jest.mock("@/constants/strings", () => ({
  globalConfiguration: "Global Configuration",
}));

// mock selectors
jest.mock("@/redux/selectors/agentManagement.selectors", () => ({
  getAgentGlobalConfig: jest.fn(),
  isGlobalConfigLoading: jest.fn(),
}));

// mock redux
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (fn: any) => fn(),
}));

// mock actions
jest.mock("@/redux/actions/agentManagement.action", () => ({
  fetchGlobalConfig: jest.fn(() => ({ type: "FETCH" })),
  saveGlobalConfig: jest.fn(payload => ({ type: "SAVE", payload })),
}));

describe("GlobalConfigurationModal", () => {
  const baseProps = {
    show: true,
    onHide: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal title", () => {
    (getAgentGlobalConfig as jest.Mock).mockReturnValue({ configs: [] });
    (isGlobalConfigLoading as jest.Mock).mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    expect(screen.getByText("Global Configuration")).toBeInTheDocument();
  });

  it("dispatches fetchGlobalConfig when show true", () => {
    (getAgentGlobalConfig as jest.Mock).mockReturnValue({ configs: [] });
    (isGlobalConfigLoading as jest.Mock).mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    expect(mockDispatch).toHaveBeenCalledWith(
      agentManagementAction.fetchGlobalConfig()
    );
  });

  it("shows loading spinner when loading true", () => {
    (getAgentGlobalConfig as jest.Mock).mockReturnValue(null);
    (isGlobalConfigLoading as jest.Mock).mockReturnValue(true);

    render(<GlobalConfigurationModal {...baseProps} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows empty state when no configs", () => {
    (getAgentGlobalConfig as jest.Mock).mockReturnValue({ configs: [] });
    (isGlobalConfigLoading as jest.Mock).mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    expect(screen.getByText("No configuration data available.")).toBeInTheDocument();
  });

  it("renders visible configs", () => {
    (getAgentGlobalConfig as jest.Mock).mockReturnValue({
      configs: [
        {
          propertyName: "apiUrl",
          propertyValue: "http://localhost",
          canModify: true,
          isVisible: true,
        },
      ],
    });
    (isGlobalConfigLoading as jest.Mock).mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    expect(screen.getByText("apiUrl")).toBeInTheDocument();
    expect(screen.getByDisplayValue("http://localhost")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    (getAgentGlobalConfig as jest.Mock).mockReturnValue({
      configs: [
        {
          propertyName: "dbPassword",
          propertyValue: "secret",
          canModify: true,
          isVisible: true,
        },
      ],
    });
    (isGlobalConfigLoading as jest.Mock).mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    const input = screen.getByDisplayValue("secret");
    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByText("Show"));

    expect(input).toHaveAttribute("type", "text");
  });

  it("updates input value on change", () => {
    (getAgentGlobalConfig as jest.Mock).mockReturnValue({
      configs: [
        {
          propertyName: "apiUrl",
          propertyValue: "old",
          canModify: true,
          isVisible: true,
        },
      ],
    });
    (isGlobalConfigLoading as jest.Mock).mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    const input = screen.getByDisplayValue("old");
    fireEvent.change(input, { target: { value: "new" } });

    expect(input).toHaveValue("new");
  });

  it("dispatches saveGlobalConfig on Save", () => {
    (getAgentGlobalConfig as jest.Mock).mockReturnValue({
      configs: [
        {
          propertyName: "apiUrl",
          propertyValue: "value",
          canModify: true,
          isVisible: true,
        },
      ],
    });
    (isGlobalConfigLoading as jest.Mock).mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    fireEvent.click(screen.getByText("Save"));

    expect(mockDispatch).toHaveBeenCalledWith(
      agentManagementAction.saveGlobalConfig({
        riseBot: [
          {
            propertyName: "apiUrl",
            propertyValue: "value",
            canModify: true,
            isVisible: true,
          },
        ],
      })
    );

    expect(baseProps.onHide).toHaveBeenCalled();
  });

  it("calls onHide on Cancel", () => {
    (getAgentGlobalConfig as jest.Mock).mockReturnValue({ configs: [] });
    (isGlobalConfigLoading as jest.Mock).mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(baseProps.onHide).toHaveBeenCalled();
  });
});
