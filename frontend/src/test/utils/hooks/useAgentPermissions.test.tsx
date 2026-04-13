/**
 * useAgentPermissions.test.tsx
 *
 * Tests for the useAgentPermissions hook — covers:
 *  - hasPermission() returns true when label exists with hasAccess: true
 *  - hasPermission() returns false when hasAccess: false
 *  - hasPermission() returns false when label not present
 *  - Falls back to host store (__REDUX_STORE__) when own store is empty
 *  - Returns false (fail-safe) when no permissions loaded at all
 *  - Guards against undefined label
 *  - loading flag forwarded from selector
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import useAgentPermissions from "../../../utils/hooks/useAgentPermissions";
import { AGENT_PERMISSIONS } from "../../../config/agentPermissionLabels";
import type { ProjectPermission } from "../../../types/UserAuthorization";

// ─── helpers ─────────────────────────────────────────────────────────────────

const mockUseSelector = jest.fn();

jest.mock("react-redux", () => ({
  useSelector: (fn: any) => mockUseSelector(fn),
}));

/** Build a minimal ProjectPermission tree with a single permission entry. */
const buildPermissions = (label: string, hasAccess: boolean): ProjectPermission[] => [
  {
    project: "agent",
    modules: [
      {
        module: "Rise Agent",
        hasAccess: true,
        permissions: [{ label, hasAccess }],
      },
    ],
  },
];

/** A simple consumer component so we can call the hook inside a render. */
const TestComponent = ({ label }: { label: string }) => {
  const { hasPermission, loading } = useAgentPermissions();
  return (
    <div>
      <span data-testid="result">{String(hasPermission(label))}</span>
      <span data-testid="loading">{String(loading)}</span>
    </div>
  );
};

// ─── tests ───────────────────────────────────────────────────────────────────

describe("useAgentPermissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Remove any host store residue
    delete (globalThis as any).__REDUX_STORE__;
  });

  // ── Own store: positive path ───────────────────────────────────────────────

  it("returns true when permission label has hasAccess: true in own store", () => {
    mockUseSelector.mockImplementation((fn: any) => {
      // getMyPermissions
      if (fn.toString().includes("myPermissions") || mockUseSelector.mock.calls.length % 2 === 1) {
        return buildPermissions(AGENT_PERMISSIONS.RISE_AGENT_ACTION_VIEW, true);
      }
      return false; // isMyPermissionsLoading
    });

    // Re-implement without relying on fn.toString — use call count
    let callCount = 0;
    mockUseSelector.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return buildPermissions(AGENT_PERMISSIONS.RISE_AGENT_ACTION_VIEW, true);
      return false;
    });

    render(<TestComponent label={AGENT_PERMISSIONS.RISE_AGENT_ACTION_VIEW} />);
    expect(screen.getByTestId("result")).toHaveTextContent("true");
  });

  it("returns false when permission label has hasAccess: false in own store", () => {
    let callCount = 0;
    mockUseSelector.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return buildPermissions(AGENT_PERMISSIONS.RISE_AGENT_STOP, false);
      return false;
    });

    render(<TestComponent label={AGENT_PERMISSIONS.RISE_AGENT_STOP} />);
    expect(screen.getByTestId("result")).toHaveTextContent("false");
  });

  it("returns false when label is not present in own store", () => {
    let callCount = 0;
    mockUseSelector.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return buildPermissions(AGENT_PERMISSIONS.RISE_AGENT_ACTION_VIEW, true);
      return false;
    });

    render(<TestComponent label={AGENT_PERMISSIONS.RISE_AGENT_START} />);
    expect(screen.getByTestId("result")).toHaveTextContent("false");
  });

  // ── No permissions loaded → fail-safe ─────────────────────────────────────

  it("returns false when own store is null and no host store", () => {
    mockUseSelector.mockReturnValue(null);
    render(<TestComponent label={AGENT_PERMISSIONS.RISE_AGENT_ACTION_VIEW} />);
    expect(screen.getByTestId("result")).toHaveTextContent("false");
  });

  it("returns false when own store is empty array and no host store", () => {
    let callCount = 0;
    mockUseSelector.mockImplementation(() => {
      callCount++;
      return callCount === 1 ? [] : false;
    });
    render(<TestComponent label={AGENT_PERMISSIONS.RISE_AGENT_ACTION_VIEW} />);
    expect(screen.getByTestId("result")).toHaveTextContent("false");
  });

  // ── Host store fallback ────────────────────────────────────────────────────

  it("falls back to __REDUX_STORE__ when own store is null", () => {
    // own store returns null
    let callCount = 0;
    mockUseSelector.mockImplementation(() => {
      callCount++;
      return callCount === 1 ? null : false;
    });

    (globalThis as any).__REDUX_STORE__ = {
      getState: () => ({
        permissions: {
          permissions: buildPermissions(AGENT_PERMISSIONS.RISE_AGENT_START, true),
        },
      }),
    };

    render(<TestComponent label={AGENT_PERMISSIONS.RISE_AGENT_START} />);
    expect(screen.getByTestId("result")).toHaveTextContent("true");
  });

  it("returns false when host store permission has hasAccess: false", () => {
    let callCount = 0;
    mockUseSelector.mockImplementation(() => {
      callCount++;
      return callCount === 1 ? null : false;
    });

    (globalThis as any).__REDUX_STORE__ = {
      getState: () => ({
        permissions: {
          permissions: buildPermissions(AGENT_PERMISSIONS.RISE_AGENT_STOP, false),
        },
      }),
    };

    render(<TestComponent label={AGENT_PERMISSIONS.RISE_AGENT_STOP} />);
    expect(screen.getByTestId("result")).toHaveTextContent("false");
  });

  it("handles corrupt __REDUX_STORE__ gracefully (returns false)", () => {
    let callCount = 0;
    mockUseSelector.mockImplementation(() => {
      callCount++;
      return callCount === 1 ? null : false;
    });

    (globalThis as any).__REDUX_STORE__ = {
      getState: () => { throw new Error("store error"); },
    };

    render(<TestComponent label={AGENT_PERMISSIONS.RISE_AGENT_ACTION_VIEW} />);
    expect(screen.getByTestId("result")).toHaveTextContent("false");
  });

  // ── Loading flag ───────────────────────────────────────────────────────────

  it("forwards loading true from selector", () => {
    let callCount = 0;
    mockUseSelector.mockImplementation(() => {
      callCount++;
      return callCount === 1 ? null : true; // 2nd call = isMyPermissionsLoading
    });

    render(<TestComponent label={AGENT_PERMISSIONS.RISE_AGENT_ACTION_VIEW} />);
    expect(screen.getByTestId("loading")).toHaveTextContent("true");
  });

  it("forwards loading false from selector", () => {
    let callCount = 0;
    mockUseSelector.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return buildPermissions(AGENT_PERMISSIONS.RISE_AGENT_ACTION_VIEW, true);
      return false;
    });

    render(<TestComponent label={AGENT_PERMISSIONS.RISE_AGENT_ACTION_VIEW} />);
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  // ── Multiple permissions in one project ───────────────────────────────────

  it("correctly checks label among multiple permissions", () => {
    const multiPerms: ProjectPermission[] = [
      {
        project: "agent",
        modules: [
          {
            module: "Rise Agent",
            hasAccess: true,
            permissions: [
              { label: AGENT_PERMISSIONS.RISE_AGENT_ACTION_VIEW,    hasAccess: true  },
              { label: AGENT_PERMISSIONS.RISE_AGENT_START,   hasAccess: true  },
              { label: AGENT_PERMISSIONS.RISE_AGENT_STOP,    hasAccess: false },
              { label: AGENT_PERMISSIONS.RISE_AGENT_RESTART, hasAccess: true  },
            ],
          },
        ],
      },
    ];

    const MultiTestComponent = () => {
      const { hasPermission } = useAgentPermissions();
      return (
        <div>
          <span data-testid="read">{String(hasPermission(AGENT_PERMISSIONS.RISE_AGENT_ACTION_VIEW))}</span>
          <span data-testid="start">{String(hasPermission(AGENT_PERMISSIONS.RISE_AGENT_START))}</span>
          <span data-testid="stop">{String(hasPermission(AGENT_PERMISSIONS.RISE_AGENT_STOP))}</span>
          <span data-testid="restart">{String(hasPermission(AGENT_PERMISSIONS.RISE_AGENT_RESTART))}</span>
        </div>
      );
    };

    mockUseSelector.mockImplementation(() => multiPerms);

    render(<MultiTestComponent />);
    expect(screen.getByTestId("read")).toHaveTextContent("true");
    expect(screen.getByTestId("start")).toHaveTextContent("true");
    expect(screen.getByTestId("stop")).toHaveTextContent("false");
    expect(screen.getByTestId("restart")).toHaveTextContent("true");
  });
});
