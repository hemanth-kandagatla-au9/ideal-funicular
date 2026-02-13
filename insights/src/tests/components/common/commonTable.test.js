import { render, screen, within } from "@testing-library/react";
import CommonTable from "../../../components/common/commonTable"; // adjust path as needed
import { UI_TEXTS } from "../../../components/common/Constants/label-contants";

// Mock the CSS module to avoid issues with className
jest.mock("../auth/role/css/taskList.module.css", () => ({
  table: "mock-table",
  tableText: "mock-table-text",
  tableRow: "mock-table-row",
  tableCell: "mock-table-cell",
  noDataText: "mock-no-data-text",
}));

describe("CommonTable", () => {
  const defaultColumns = [
    { key: "name", label: "Name" },
    { key: "age", label: "Age", align: "right" },
    { key: "city", label: "City" },
  ];

  const defaultData = [
    { _id: "1", name: "Alice", age: 28, city: "Berlin" },
    { _id: "2", name: "Bob", age: 34, city: "Tokyo" },
  ];

  it("renders table with correct number of columns", () => {
    render(<CommonTable columns={defaultColumns} data={defaultData} />);

    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(defaultColumns.length);

    expect(headers[0]).toHaveTextContent("Name");
    expect(headers[1]).toHaveTextContent("Age");
    expect(headers[2]).toHaveTextContent("City");
  });

  it("applies alignment styles to headers", () => {
    render(<CommonTable columns={defaultColumns} data={defaultData} />);

    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveStyle({ textAlign: "left" }); // default
    expect(headers[1]).toHaveStyle({ textAlign: "right" });
    expect(headers[2]).toHaveStyle({ textAlign: "left" }); // default
  });
  // ────────────────────────────────────────────────
  // At the TOP of your test file (commonTable.test.js)
  // make sure this line includes 'within'
  // ────────────────────────────────────────────────

  it("renders all rows and cells when data is provided", () => {
    render(<CommonTable columns={defaultColumns} data={defaultData} />);

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(1 + defaultData.length); // header + data rows

    // ────────────────────────────────────────────────
    // Now within() will be defined
    // ────────────────────────────────────────────────

    // First data row = rows[1] (rows[0] is the header)
    const firstRowCells = within(rows[1]).getAllByRole("cell");
    expect(firstRowCells).toHaveLength(defaultColumns.length);

    expect(firstRowCells[0]).toHaveTextContent("Alice");
    expect(firstRowCells[1]).toHaveTextContent("28");
    expect(firstRowCells[2]).toHaveTextContent("Berlin");

    // Second data row
    const secondRowCells = within(rows[2]).getAllByRole("cell");
    expect(secondRowCells[0]).toHaveTextContent("Bob");
    // ... add more assertions if needed
  });

  it('shows "No records found" message when data is empty', () => {
    render(<CommonTable columns={defaultColumns} data={[]} />);

    expect(
      screen.getByText(UI_TEXTS.NOT_FOUND.NO_RECORDS_FOUND)
    ).toBeInTheDocument();

    const noDataCell = screen.getByText(UI_TEXTS.NOT_FOUND.NO_RECORDS_FOUND);
    expect(noDataCell).toHaveAttribute("colSpan", "3"); // number of columns
  });

  it('shows "No records found" when data is undefined', () => {
    // @ts-expect-error testing invalid prop
    render(<CommonTable columns={defaultColumns} data={undefined} />);

    expect(
      screen.getByText(UI_TEXTS.NOT_FOUND.NO_RECORDS_FOUND)
    ).toBeInTheDocument();
  });

  it("uses _id for key when available, falls back to index", () => {
    const dataWithoutId = [
      { name: "Charlie", age: 42 },
      { name: "Dana", age: 19 },
    ];

    const { container } = render(
      <CommonTable columns={defaultColumns} data={dataWithoutId} />
    );

    const rows = container.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(2);

    // We can't directly assert keys in DOM, but we can ensure no key warnings in console
    // (this is more of a "no error" test)
  });

  it("applies custom class names from classes prop", () => {
    render(
      <CommonTable
        columns={defaultColumns}
        data={defaultData}
        classes={{
          table: "custom-table-class",
          tableText: "custom-header-class",
          tableRow: "custom-row-class",
          tableCell: "custom-cell-class",
          noDataText: "custom-no-data-class",
        }}
      />
    );

    const table = screen.getByRole("table");
    expect(table).toHaveClass("custom-table-class");

    const headers = screen.getAllByRole("columnheader");
    headers.forEach((header) => {
      expect(header).toHaveClass("custom-header-class");
    });

    const cells = screen.getAllByRole("cell");
    cells.forEach((cell) => {
      if (cell.textContent !== UI_TEXTS.NOT_FOUND.NO_RECORDS_FOUND) {
        expect(cell).toHaveClass("custom-cell-class");
      }
    });
  });

  it("applies additional styles from column definition", () => {
    const columnsWithStyle = [
      { key: "name", label: "Name" },
      {
        key: "age",
        label: "Age",
        style: { backgroundColor: "#f0f8ff", fontWeight: 600 },
      },
    ];

    render(<CommonTable columns={columnsWithStyle} data={defaultData} />);

    const ageHeader = screen.getByText("Age");
    expect(ageHeader).toHaveStyle({
      backgroundColor: "#f0f8ff",
      fontWeight: 600,
    });
  });
});
