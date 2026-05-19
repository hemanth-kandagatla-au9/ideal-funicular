// src/components/Navigation/__tests__/Navbar.test.tsx

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasPermission } from '../../../utils/permissionUtil';
import Navbar from '../Navbar';

// Mocks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../../../utils/permissionUtil', () => ({
  hasPermission: jest.fn(),
}));

jest.mock('../../Gridpopup/GridPopup', () => (props: any) => (
  <div data-testid="grid-popup">
    <button onClick={() => props.onToggleSelect('workflow')}>toggle-workflow</button>
    <button onClick={() => props.onToggleSelect('capability')}>toggle-capability</button>
    <button onClick={props.onClose}>close</button>
  </div>
));

describe('Navbar', () => {
  const renderAt = (route = '/app/workflow') =>
    render(
      <MemoryRouter initialEntries={[route]}>
        <Navbar />
      </MemoryRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as jest.Mock).mockReturnValue({ permissions: ['all'] });
    (hasPermission as jest.Mock).mockImplementation(() => true);
    localStorage.clear();
  });

  // Helper: get pinned container using CSS module class (identity-obj-proxy exposes key names)
  const getPinnedContainer = () => {
    return document.querySelector('.navWrap') as HTMLElement | null;
  };

  it('renders default pinned tabs and persists them when no localStorage present', () => {
    renderAt();
    expect(screen.getByText('My Space')).toBeInTheDocument();
    expect(screen.getByText('Execution')).toBeInTheDocument();
    expect(screen.getByText('Report')).toBeInTheDocument();

    const stored = localStorage.getItem('pinnedApps');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored as string)).toEqual(['workflow', 'execution', 'reports']);
  });

  it('loads pinned apps from localStorage (no dynamic tab appears for different current route)', () => {
    localStorage.setItem('pinnedApps', JSON.stringify(['execution']));
    // Use a route that is pinned so dynamic tab doesn't inject "My Space"
    renderAt('/app/workflow/execution');

    expect(screen.getByText('Execution')).toBeInTheDocument();
    expect(screen.queryByText('My Space')).not.toBeInTheDocument();
    expect(screen.queryByText('Report')).not.toBeInTheDocument();
  });

  it('shows dynamic tab when route not pinned', () => {
    renderAt('/app/workflow/metrics');
    expect(screen.getByText('Metrics')).toBeInTheDocument();
  });

  it('opens and closes grid popup; toggling workflow removes it from pinned (avoid dynamic by using execution route)', () => {
    // Use a route that is not "workflow" to avoid dynamic "My Space"
    renderAt('/app/workflow/execution');

    fireEvent.click(screen.getByAltText('menu'));
    expect(screen.getByTestId('grid-popup')).toBeInTheDocument();

    // Toggle workflow -> removes 'My Space' from pinned
    fireEvent.click(screen.getByText('toggle-workflow'));
    expect(screen.queryByText('My Space')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('close'));
    expect(screen.queryByTestId('grid-popup')).not.toBeInTheDocument();
  });

  it('respects maxSelected=3 (does not add a new item when already at 3)', () => {
    renderAt();
    // Default has 3 pinned
    fireEvent.click(screen.getByAltText('menu'));
    expect(screen.getByTestId('grid-popup')).toBeInTheDocument();

    // Try to add a fourth: 'Capability'
    fireEvent.click(screen.getByText('toggle-capability'));
    // Should NOT appear among pinned tabs because maxSelected reached
    expect(screen.queryByText('Capability')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('close'));
  });

  it('closes popup on outside click', () => {
    renderAt();

    fireEvent.click(screen.getByAltText('menu'));
    expect(screen.getByTestId('grid-popup')).toBeInTheDocument();

    // Outside click
    fireEvent.mouseDown(document);
    expect(screen.queryByTestId('grid-popup')).not.toBeInTheDocument();
  });

  it('reorders pinned tabs via drag-and-drop and shows drop indicator while hovering', () => {
    renderAt(); // Default route "/app/workflow" (dynamic tab is null)

    const first = screen.getByText('My Space');
    const third = screen.getByText('Report');

    // Start dragging "Report" and hover over "My Space"
    fireEvent.dragStart(third);
    fireEvent.dragEnter(first);

    // The drop indicator should appear on hover
    const navWrap = getPinnedContainer();
    expect(navWrap).toBeTruthy();
    if (navWrap) {
      expect(navWrap.querySelector('.dropIndicator')).toBeInTheDocument();
    }

    // Drop onto "My Space" and end drag (Report should move to first position)
    fireEvent.drop(first);
    fireEvent.dragEnd(third);

    if (navWrap) {
      // Collect the pinned tab labels in order from the container
      const labels = Array.from(navWrap.querySelectorAll('.tabContent')).map(
        (el) => (el as HTMLElement).textContent
      );
      // After reordering, "Report" should now be first
      expect(labels[0]).toBe('Report');
    }
  });

  it('filters accessible apps using hasPermission and hides dynamic tab for inaccessible route', () => {
    // Only allow my space & execution
    (hasPermission as jest.Mock).mockImplementation(
      (_p: any, _proj: string, _mod: string, perm: string) =>
        ['IASphere : my space', 'IASphere : execution'].includes(perm)
    );

    renderAt('/app/workflow/metrics');

    // Dynamic 'Metrics' denied
    expect(screen.queryByText('Metrics')).not.toBeInTheDocument();

    // Only allowed pinned should be visible
    expect(screen.getByText('My Space')).toBeInTheDocument();
    expect(screen.getByText('Execution')).toBeInTheDocument();
    expect(screen.queryByText('Report')).not.toBeInTheDocument();
  });

  // Extra coverage: add branch when pinned count < 3
  it('adds a selection when pinned count is less than 3 (covers add branch)', () => {
    // Start with only 2 pinned to trigger the "... : [...prev, id]" branch
    localStorage.setItem('pinnedApps', JSON.stringify(['execution', 'reports']));
    // Use an execution route so dynamic "My Space" is not auto-inserted
    renderAt('/app/workflow/execution');

    // Open grid and add "workflow" (My Space)
    fireEvent.click(screen.getByAltText('menu'));
    expect(screen.getByTestId('grid-popup')).toBeInTheDocument();

    fireEvent.click(screen.getByText('toggle-workflow'));
    // "My Space" should now be pinned (added)
    expect(screen.getByText('My Space')).toBeInTheDocument();

    // Close popup
    fireEvent.click(screen.getByText('close'));
    expect(screen.queryByTestId('grid-popup')).not.toBeInTheDocument();
  });

  // Extra coverage: prefix match for nested routes
  it('resolves current app by prefix match for nested routes (covers prefix-match branch)', () => {
    // Route deeper than app.route → currentAppId via prefixMatch
    renderAt('/app/workflow/capability/cap-42');
    // "Capability" (not in default pinned) should render as a dynamic tab
    expect(screen.getByText('Capability')).toBeInTheDocument();
  });
});
