import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import Cookies from 'universal-cookie';
import LandingPageHeader from '../DashboardHeader';

// Mock Navbar
jest.mock('../../Navigation/Navbar', () => () => <div>Navbar</div>);

// Mock CSS
jest.mock('../../Dashboard/dashboard.module.scss', () => ({
  header: 'header',
  lp_header_l1: 'lp_header_l1',
  subheader_text: 'subheader_text',
  right_header: 'right_header',
  lp_header_l1_welcome: 'lp_header_l1_welcome',
}));

// Mock Cookies
jest.mock('universal-cookie');

describe('LandingPageHeader', () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    (Cookies as jest.Mock).mockImplementation(() => ({
      get: mockGet,
    }));
    mockGet.mockReturnValue('Racheal');
    sessionStorage.clear();
  });

  const renderWithRoute = (path: string, state?: any) => {
    return render(
      <MemoryRouter initialEntries={[{ pathname: path, state }]}>
        <Route path="*">
          <LandingPageHeader />
        </Route>
      </MemoryRouter>
    );
  };

  test('renders workflow home with username', () => {
    renderWithRoute('/app/workflow');

    expect(screen.getByText(/My Space/i)).toBeInTheDocument();
  });

  test('renders normal matched route', () => {
    renderWithRoute('/app/workflow/metrics');

    expect(screen.getByText('Metrics')).toBeInTheDocument();
    expect(screen.getByText(/Track efficiency, savings/i)).toBeInTheDocument();
  });

  test('renders unauthorized with deniedPath from location.state', () => {
    renderWithRoute('/app/unauthorized', {
      deniedPath: '/app/workflow/metrics',
    });

    expect(screen.getByText('Metrics')).toBeInTheDocument();
    expect(screen.getByText(/Access denied. You do not have permission/i)).toBeInTheDocument();
  });

  test('renders unauthorized with deniedPath from sessionStorage', () => {
    sessionStorage.setItem('deniedRoute', '/app/workflow/execution');

    renderWithRoute('/app/unauthorized');

    expect(screen.getByText('Executions')).toBeInTheDocument();
  });

  test('renders fallback when no route matches', () => {
    renderWithRoute('/random-path');

    // Empty heading fallback
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });
});
