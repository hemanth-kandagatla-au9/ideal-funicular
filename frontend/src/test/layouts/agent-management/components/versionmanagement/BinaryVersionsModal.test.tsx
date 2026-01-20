import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BinaryVersionsModal from "../../../../../layouts/agent-management/components/versionmanagement/BinaryVersionsModal";

// ---- Mocks ----
jest.mock("../../../../../layouts/agent-management/components/versionmanagement/BinaryVersionsModalLayout", () => (props: any) => (
  <div>
    <h1>{props.title}</h1>
    {props.open && <div data-testid="modal">{props.children}</div>}
  </div>
));

jest.mock("../../../../../layouts/agent-management/components/versionmanagement/BinaryVersionsFormField", () => () => (
  <div data-testid="form-fields" />
));

jest.mock("../../../../../layouts/agent-management/components/versionmanagement/BinaryFormButtons", () => (props: any) => (
  <div>
    <button onClick={props.onCancel}>Cancel</button>
    {!props.isViewMode && (
      <button type="submit" disabled={!props.hasChanges}>
        Submit
      </button>
    )}
  </div>
));

describe("BinaryVersionsModal", () => {
  const baseProps = {
    open: true,
    onClose: jest.fn(),
    handleAddBinaryVersion: jest.fn(),
    handleUpdateBinaryVersion: jest.fn(),
    editingVersion: null,
    isViewMode: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Add Binary title when creating", () => {
    render(<BinaryVersionsModal {...baseProps} />);

    expect(screen.getByText("Add Binary")).toBeInTheDocument();
  });

  it("renders Edit Binary title when editing", () => {
    render(
      <BinaryVersionsModal
        {...baseProps}
        editingVersion={{ id: "1", version: "v1", osEntries: [], upgradeType: "Optional" }}
      />
    );

    expect(screen.getByText("Edit Binary")).toBeInTheDocument();
  });

  it("renders View Binary Details when in view mode", () => {
    render(
      <BinaryVersionsModal
        {...baseProps}
        isViewMode
        editingVersion={{ id: "1", version: "v1", osEntries: [], upgradeType: "Optional" }}
      />
    );

    expect(screen.getByText("View Binary Details")).toBeInTheDocument();
  });

  it("calls onClose when cancel clicked", () => {
    render(<BinaryVersionsModal {...baseProps} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(baseProps.onClose).toHaveBeenCalled();
  });

  it("disables submit when editing and no changes", () => {
    render(
      <BinaryVersionsModal
        {...baseProps}
        editingVersion={{
          id: "1",
          version: "v1",
          osEntries: [],
          upgradeType: "Optional",
        }}
      />
    );

    expect(screen.getByText("Submit")).toBeDisabled();
  });
});
