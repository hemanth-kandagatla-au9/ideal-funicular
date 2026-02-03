import { render, screen, fireEvent } from "@testing-library/react";
import BinaryFilterBar from "../../../../../layouts/agent-management/components/versionmanagement/BinaryFilterBar";
import "@testing-library/jest-dom";

jest.mock("../../../../images/agent-management/assets/crossBlack.svg", () => "mock-image");
jest.mock("../../../../../../src/layouts/agent-management/components/MultiSelectDropdown", () => (props: any) => {
  return (
    <div data-testid={`mock-dropdown-${props.id}`}>
      <button onClick={() => props.toggleOpen()}>Toggle {props.id}</button>

      <button onClick={() => props.onSelectChange([{ value: "select-all" }])}>SelectAll {props.id}</button>

      <button onClick={() => props.onSelectChange([{ value: "Windows" }, { value: "Linux" }])}>SelectSome {props.id}</button>

      <button onClick={() => props.clearAll()}>Clear {props.id}</button>
    </div>
  );
});

describe("BinaryFilterBar", () => {
  const baseProps = {
    osOptions: ["Windows", "Linux"],
    versionOptions: ["1.0", "2.0"],
    typeOptions: ["Agent", "Worker"],
    filters: {
      os: [],
      versions: [],
      types: [],
    },
    setFilters: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all dropdowns", () => {
    render(<BinaryFilterBar {...baseProps} />);

    expect(screen.getByTestId("mock-dropdown-dropdown-os")).toBeInTheDocument();
    expect(screen.getByTestId("mock-dropdown-dropdown-versions")).toBeInTheDocument();
    expect(screen.getByTestId("mock-dropdown-dropdown-types")).toBeInTheDocument();
  });

  it("handles select-all for OS", () => {
    render(<BinaryFilterBar {...baseProps} />);

    fireEvent.click(screen.getByText("SelectAll dropdown-os"));

    expect(baseProps.setFilters).toHaveBeenCalledWith({
      ...baseProps.filters,
      os: ["Windows", "Linux"],
    });
  });

  it("handles individual selection", () => {
    render(<BinaryFilterBar {...baseProps} />);

    fireEvent.click(screen.getByText("SelectSome dropdown-os"));

    expect(baseProps.setFilters).toHaveBeenCalledWith({
      ...baseProps.filters,
      os: ["Windows", "Linux"],
    });
  });

  it("clear button clears specific filter", () => {
    const props = {
      ...baseProps,
      filters: {
        os: ["Windows"],
        versions: [],
        types: [],
      },
    };

    render(<BinaryFilterBar {...props} />);

    fireEvent.click(screen.getByAltText("Remove"));

    expect(props.setFilters).toHaveBeenCalledWith({
      os: [],
      versions: [],
      types: [],
    });
  });

  it("Clear All button resets all filters", () => {
    const props = {
      ...baseProps,
      filters: {
        os: ["Windows"],
        versions: ["1.0"],
        types: ["Agent"],
      },
    };

    render(<BinaryFilterBar {...props} />);

    fireEvent.click(screen.getByText("Clear All"));

    expect(props.setFilters).toHaveBeenCalledWith({
      os: [],
      versions: [],
      types: [],
    });
  });

  it("clicking filter value toggles dropdown", () => {
    const props = {
      ...baseProps,
      filters: {
        os: ["Windows"],
        versions: [],
        types: [],
      },
    };

    render(<BinaryFilterBar {...props} />);

    fireEvent.click(screen.getByText("Windows"));
    expect(screen.getByText("Windows")).toBeInTheDocument();
  });
});
