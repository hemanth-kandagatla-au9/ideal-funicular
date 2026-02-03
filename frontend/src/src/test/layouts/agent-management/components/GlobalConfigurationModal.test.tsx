import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import agentManagementAction from "@/redux/actions/agentManagement.action";
import { getAgentGlobalConfig, isGlobalConfigLoading } from "@/redux/selectors/agentManagement.selectors";
import GlobalConfigurationModal from "../../../../layouts/agent-management/components/GlobalConfigurationModal";

const mockedGetAgentGlobalConfig = getAgentGlobalConfig as unknown as jest.Mock;
const mockedIsGlobalConfigLoading = isGlobalConfigLoading as unknown as jest.Mock;

// mock constants
jest.mock("@/constants/strings", () => ({
  viewEditConfigurationButtonText: "View/Edit Configuration",
  updateButtonText: "Update",
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
    mockedGetAgentGlobalConfig.mockReturnValue({ configs: [] });
    mockedIsGlobalConfigLoading.mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    expect(screen.getByText("View/ Edit Configuration")).toBeInTheDocument();
  });

  it("dispatches fetchGlobalConfig when show true", () => {
    mockedGetAgentGlobalConfig.mockReturnValue({ configs: [] });
    mockedIsGlobalConfigLoading.mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    expect(mockDispatch).toHaveBeenCalledWith(agentManagementAction.fetchGlobalConfig());
  });

  it("shows loading spinner when loading true", () => {
    mockedGetAgentGlobalConfig.mockReturnValue(null);
    mockedIsGlobalConfigLoading.mockReturnValue(true);

    render(<GlobalConfigurationModal {...baseProps} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows empty state when no configs", () => {
    mockedGetAgentGlobalConfig.mockReturnValue({ configs: [] });
    mockedIsGlobalConfigLoading.mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    expect(screen.getByText("No configuration data available.")).toBeInTheDocument();
  });

  it("renders visible configs", () => {
    mockedGetAgentGlobalConfig.mockReturnValue({
      configs: [
        {
          propertyName: "apiUrl",
          propertyValue: "http://localhost",
          canModify: true,
          isVisible: true,
        },
      ],
    });
    mockedIsGlobalConfigLoading.mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    expect(screen.getByText("Api Url")).toBeInTheDocument();
    expect(screen.getByDisplayValue("http://localhost")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    mockedGetAgentGlobalConfig.mockReturnValue({
      configs: [
        {
          propertyName: "dbPassword",
          propertyValue: "secret",
          canModify: true,
          isVisible: true,
        },
      ],
    });
    mockedIsGlobalConfigLoading.mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    const input = screen.getByDisplayValue("secret");
    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "Show password" }));

    expect(input).toHaveAttribute("type", "text");
  });

  it("updates input value on change", () => {
    mockedGetAgentGlobalConfig.mockReturnValue({
      configs: [
        {
          propertyName: "apiUrl",
          propertyValue: "old",
          canModify: true,
          isVisible: true,
        },
      ],
    });
    mockedIsGlobalConfigLoading.mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    const input = screen.getByDisplayValue("old");
    fireEvent.change(input, { target: { value: "new" } });

    expect(input).toHaveValue("new");
  });

  it("calls onHide on Cancel", () => {
    mockedGetAgentGlobalConfig.mockReturnValue({ configs: [] });
    mockedIsGlobalConfigLoading.mockReturnValue(false);

    render(<GlobalConfigurationModal {...baseProps} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(baseProps.onHide).toHaveBeenCalled();
  });
});
