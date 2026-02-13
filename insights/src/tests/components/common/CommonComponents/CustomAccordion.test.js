import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import JobSummary from "../../../../components/common/CommonComponents/CustomAccordion";

afterEach(() => cleanup());

describe("JobSummary (CustomAccordion) component", () => {
  test("renders all provided jobData fields and tags", () => {
    const jobData = {
      jobName: "My Job",
      categoryName: "My Category",
      scheduleType: "Daily",
      categoryType: "Batch",
      tags: ["tag1", "tag2"],
    };

    render(<JobSummary jobData={jobData} />);

    expect(screen.getByText("My Job")).toBeInTheDocument();
    expect(screen.getByText("My Category")).toBeInTheDocument();
    expect(screen.getByText("Daily")).toBeInTheDocument();
    expect(screen.getByText("Batch")).toBeInTheDocument();
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  test("renders fallback '-' when fields are missing or tags are empty", () => {
    render(<JobSummary jobData={{}} />);

    const dashes = screen.getAllByText("-");
    // Expected fallbacks: job title, job category, schedule type, job tags, type
    expect(dashes.length).toBeGreaterThanOrEqual(5);
  });

  test("renders fallback '-' when no jobData prop is provided", () => {
    render(<JobSummary />);
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBeGreaterThanOrEqual(5);
  });
});
