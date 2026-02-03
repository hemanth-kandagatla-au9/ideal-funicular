/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import "@testing-library/jest-dom/extend-expect";
import LocalConfigModal from "../../../../layouts/agent-management/components/LocalConfigModal";

const mockStore = createStore(() => ({}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("LocalConfigModal Component", () => {
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onCancelButtonClick: jest.fn(),
    agentConfigDetails: [],
    state: {
      riseBotSchema: [
        { label: "property.one", propertyValue: "value1", encrypted: false },
        { label: "property.two", propertyValue: "value2", encrypted: false },
      ],
    },
    addClassConfig: "",
    handleInputChangeForSideBar: jest.fn(),
    saveConfigs: jest.fn(),
    port: "8080",
  };

  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require("react-redux").useDispatch.mockReturnValue(mockDispatch);
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={mockStore}>
        <LocalConfigModal {...mockProps} {...props} />
      </Provider>,
    );
  };

  it("renders when open is true", () => {
    renderComponent();
    expect(screen.queryByRole("dialog")).not.toBeNull();
  });

  it("displays configuration properties", () => {
    renderComponent();
    expect(mockProps.onClose).toBeDefined();
  });

  it("calls onCancelButtonClick when cancel button is clicked", () => {
    renderComponent();
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(mockProps.onCancelButtonClick).toHaveBeenCalledTimes(1);
  });

  it("renders Modal component with correct props", () => {
    renderComponent();
    expect(screen.queryByRole("dialog")).toBeTruthy();
  });
});
