import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import GridDropdown from '../GridPopup';
import { hasPermission } from '../../../utils/permissionUtil';

// Mock redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

// Mock permission util
jest.mock('../../../utils/permissionUtil', () => ({
  hasPermission: jest.fn(),
}));

// Mock icons (optional safety)
jest.mock('lucide-react', () => ({
  CheckCircle2: () => <div>check</div>,
  Search: () => <div>search</div>,
}));

const mockUseSelector = useSelector as jest.Mock;

const renderComponent = (selectorState: any, props: any = {}) => {
  const history = createMemoryHistory();

  mockUseSelector.mockImplementation((fn) => fn(selectorState));

  render(
    <Router history={history}>
      <GridDropdown
        apps={props.apps || []}
        selectedIds={props.selectedIds || []}
        onToggleSelect={props.onToggleSelect || jest.fn()}
        onClose={props.onClose || jest.fn()}
      />
    </Router>
  );

  return { history };
};

describe('GridDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const apps = [
    {
      id: '1',
      name: 'App One',
      icon: <div>Icon</div>,
      route: '/app1',
      project: 'p1',
      module: 'm1',
    },
    {
      id: '2',
      name: 'Hidden App',
      icon: <div>Icon</div>,
      route: '/app2',
      project: 'p2',
      module: 'm2',
      openInNewWindow: true,
    },
  ];

  test('full coverage in one test', () => {
    // 1. Loading state
    renderComponent({
      permissions: { permissions: [], loaded: false },
    });
    expect(screen.getByText(/Loading permissions/i)).toBeInTheDocument();

    // 2. No apps found
    (hasPermission as jest.Mock).mockReturnValue(false);

    renderComponent({ permissions: { permissions: [], loaded: true } }, { apps });
    expect(screen.getByText(/No apps found/i)).toBeInTheDocument();

    // 3. Show apps (permission filter)
    (hasPermission as jest.Mock).mockImplementation((_: any, project: string) => project === 'p1');

    const onToggleSelect = jest.fn();
    const onClose = jest.fn();

    const { history } = renderComponent(
      { permissions: { permissions: [{}], loaded: true } },
      { apps, selectedIds: ['1'], onToggleSelect, onClose }
    );

    expect(screen.getByText('App One')).toBeInTheDocument();
    expect(screen.queryByText('Hidden App')).not.toBeInTheDocument();

    // 5. Hover + toggle select
    const item = screen.getByText('App One').closest('div');
    fireEvent.mouseEnter(item!);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onToggleSelect).toHaveBeenCalledWith('1');

    // 6. Navigation (history.push)
    fireEvent.click(screen.getByText('App One'));
    expect(onClose).toHaveBeenCalled();
    expect(history.location.pathname).toBe('/app1');

    // 7. window.open branch
    (hasPermission as jest.Mock).mockReturnValue(true);
    window.open = jest.fn();

    renderComponent({ permissions: { permissions: [{}], loaded: true } }, { apps });

    fireEvent.click(screen.getByText('Hidden App'));
    expect(window.open).toHaveBeenCalled();
  });
});
