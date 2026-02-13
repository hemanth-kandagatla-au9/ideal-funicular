import { render, screen } from "@testing-library/react";
import CommonProgressBar from "../../../../components/common/CommonComponents/ProgressBars";

// Mock bootstrap ProgressBar (simplest way for testing)
jest.mock("react-bootstrap/ProgressBar", () => {
  return function MockProgressBar({ now, label, className, style }) {
    return (
      <div
        data-testid="progress-bar"
        className={className}
        style={style}
        aria-valuenow={now}
        aria-valuemax="100"
      >
        {label}
      </div>
    );
  };
});

describe("CommonProgressBar", () => {
  it("renders with 0% when successHosts = 0", () => {
    const props = {
      originalJobData: { total: 10, failure: 10 },
      openSearchData: [],
      jobRunID: "abc123",
    };

    render(<CommonProgressBar {...props} />);

    const progress = screen.getByTestId("progress-bar");
    expect(progress).toHaveAttribute("aria-valuenow", "0");
    expect(progress).toHaveTextContent("0%");
  });

  it("caps percentage at 100% even if more servers are reported", () => {
    const props = {
      originalJobData: { total: 5, failure: 0 }, // success = 5
      openSearchData: [
        {
          runId: "run-abc",
          servers: ["h1", "h2", "h3", "h4", "h5", "h6", "h7"],
        },
      ],
      jobRunID: "run-abc",
    };

    render(<CommonProgressBar {...props} />);

    const progress = screen.getByTestId("progress-bar");
    expect(progress).toHaveAttribute("aria-valuenow", "100");
    expect(progress).toHaveTextContent("100%");
  });

  it("handles Infinity case (division by zero) → shows 0%", () => {
    const props = {
      originalJobData: { total: 0, failure: 0 }, // success = 0
      openSearchData: [{ runId: "job-999", servers: ["server1"] }],
      jobRunID: "job-999",
    };

    render(<CommonProgressBar {...props} />);

    expect(screen.getByTestId("progress-bar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
    expect(screen.getByTestId("progress-bar")).toHaveTextContent("0%");
  });

  it("applies correct height style", () => {
    const props = {
      originalJobData: { total: 10, failure: 3 },
      openSearchData: [],
      jobRunID: "test-run",
    };

    const { container } = render(<CommonProgressBar {...props} />);

    const progress = container.querySelector('[data-testid="progress-bar"]');
    expect(progress).toHaveStyle({ height: "20px" });
  });

  it("applies customProgressBar class", () => {
    const props = {
      originalJobData: { total: 4, failure: 1 },
      openSearchData: [],
      jobRunID: "run-xyz",
    };

    render(<CommonProgressBar {...props} />);

    expect(screen.getByTestId("progress-bar")).toHaveClass("customProgressBar");
  });

  it("handles missing originalJobData gracefully", () => {
    const props = {
      originalJobData: undefined,
      openSearchData: [],
      jobRunID: "job-123",
    };

    render(<CommonProgressBar {...props} />);

    // total = 0, failure = 0 → success = 0 → percentage = 0
    expect(screen.getByTestId("progress-bar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
  });
});
