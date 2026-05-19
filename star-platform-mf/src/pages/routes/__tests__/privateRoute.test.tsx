import React from 'react';
import { render, screen } from '@testing-library/react';
import { Route, MemoryRouter } from 'react-router-dom';
import PrivateRoute from '../privateRoute';
import * as redux from 'react-redux';
import * as permissionUtil from '../../../utils/permissionUtil';
jest.mock('react-redux');

const mockUseSelector = redux.useSelector as jest.Mock;

// Dummy component
const TestComponent = () => <div>Protected Page</div>;

describe('PrivateRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  const renderWithRouter = (ui: React.ReactNode, route = '/test') => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Route path="/test">{ui}</Route>
      </MemoryRouter>
    );
  };

  test('returns null when permissions not loaded', () => {
    mockUseSelector.mockReturnValue({
      permissions: [],
      loaded: false,
    });

    const { container } = renderWithRouter(
      <PrivateRoute
        path="/test"
        component={TestComponent}
        project="P1"
        module="M1"
        permissionLabel="VIEW"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('redirects when permissionLabel is missing', () => {
    mockUseSelector.mockReturnValue({
      permissions: [],
      loaded: true,
    });

    renderWithRouter(
      <PrivateRoute path="/test" component={TestComponent} project="P1" module="M1" />
    );

    expect(sessionStorage.getItem('deniedRoute')).toBe('/test');
  });

  test('renders component when permission is allowed', () => {
    mockUseSelector.mockReturnValue({
      permissions: [],
      loaded: true,
    });

    jest.spyOn(permissionUtil, 'hasPermission').mockReturnValue(true);

    renderWithRouter(
      <PrivateRoute
        path="/test"
        component={TestComponent}
        project="P1"
        module="M1"
        permissionLabel="VIEW"
      />
    );

    expect(screen.getByText('Protected Page')).toBeInTheDocument();
  });

  test('redirects when permission is denied', () => {
    mockUseSelector.mockReturnValue({
      permissions: [],
      loaded: true,
    });

    jest.spyOn(permissionUtil, 'hasPermission').mockReturnValue(false);

    renderWithRouter(
      <PrivateRoute
        path="/test"
        component={TestComponent}
        project="P1"
        module="M1"
        permissionLabel="VIEW"
      />
    );

    expect(sessionStorage.getItem('deniedRoute')).toBe('/test');
  });
});
