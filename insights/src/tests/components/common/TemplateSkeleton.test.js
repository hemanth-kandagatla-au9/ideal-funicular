import { render, screen } from "@testing-library/react";
import TemplateCardSkeleton from "../../../components/common/TemplateSkeleton"; // adjust path as needed

describe("TemplateCardSkeleton", () => {
  it("renders the root Card with correct styles", () => {
    const { container } = render(<TemplateCardSkeleton />);

    const card = container.firstChild;
    expect(card).toHaveStyle({
      width: "100%",
      minHeight: "150px",
      borderRadius: "12px",
      border: "1px solid #e0e0e0",
      boxShadow: "none",
    });
  });

  it("renders two description line skeletons", () => {
    render(<TemplateCardSkeleton />);

    const lineSkeletons = Array.from(
      document.querySelectorAll(".MuiSkeleton-text")
    ).filter((el) => el.style.height === "10px");

    expect(lineSkeletons).toHaveLength(2);

    // First line full width (default)
    expect(lineSkeletons[0]).toHaveStyle({ marginBottom: "6px" });

    // Second line 80% width
    expect(lineSkeletons[1]).toHaveStyle({ width: "80%" });
  });

  it("renders three chip/tag skeletons in the bottom row", () => {
    render(<TemplateCardSkeleton />);

    const chipSkeletons = document.querySelectorAll(
      '[style*="display: flex"][style*="gap: 8px"] .MuiSkeleton-rounded'
    );

    expect(chipSkeletons).toHaveLength(3);

    // Approximate width check (can be flaky — better with data-testid)
    expect(chipSkeletons[0]).toHaveStyle({ width: "60px", height: "20px" });
    expect(chipSkeletons[1]).toHaveStyle({ width: "70px", height: "20px" });
    expect(chipSkeletons[2]).toHaveStyle({ width: "50px", height: "20px" });
  });

  // === More maintainable version with data-testid (recommended) ===
});
