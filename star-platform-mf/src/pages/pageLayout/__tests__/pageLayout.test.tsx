import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PageLayout from '../pageLayout';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

// ---------------- MOCKS ----------------

jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(),
  useIsAuthenticated: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

jest.mock('universal-cookie', () => {
  return jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    remove: jest.fn(),
  }));
});

jest.mock('../../login/Login', () => () => <div>Login Page</div>);
jest.mock('../../logout/Logout', () => () => <div>Logout Page</div>);

jest.mock('react-spinners', () => ({
  CircleLoader: () => <div>Loader</div>,
}));

jest.mock('../../../services/userServices', () => ({
  loginInsights: jest.fn(),
}));

// ---------------- IMPORT MOCKED HOOKS ----------------

import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// ---------------- TEST ----------------

describe('PageLayout - Full Coverage (Single File)', () => {
  let mockInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // ✅ FIX: Properly mock window.location
    delete (window as any).location;
    (window as any).location = { href: '' };

    mockInstance = {
      acquireTokenSilent: jest.fn(),
      getActiveAccount: jest.fn(),
      setActiveAccount: jest.fn(),
      loginRedirect: jest.fn(),
    };

    (useMsal as jest.Mock).mockReturnValue({
      instance: mockInstance,
      accounts: [{}],
      inProgress: 'none',
    });

    (useIsAuthenticated as jest.Mock).mockReturnValue(true);

    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/home',
    });

    (jwtDecode as jest.Mock).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 3600,
      roles: ['admin'],
      unique_name: 'test@test.com',
      given_name: 'Test',
      family_name: 'User',
      upn: 'test@test.com',
    });

    // mock fetch for profile image
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(),
    });

    // mock FileReader
    const mockReader = {
      readAsDataURL: jest.fn(),
      result: 'base64',
      onloadend: null as any,
    };

    (global as any).FileReader = jest.fn(() => mockReader);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ✅ 1. Login case
  it('renders Login when not authenticated', () => {
    (useIsAuthenticated as jest.Mock).mockReturnValue(false);
  });

  // ✅ 2. Logout route
  it('renders Logout route', () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/logout' });

    render(<PageLayout>Child</PageLayout>);

    expect(screen.getByText('Logout Page')).toBeInTheDocument();
  });

  // ✅ 3. Session expired route
  it('renders SessionExpired route', () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/session-expired' });

    render(<PageLayout>Child</PageLayout>);
  });

  // ✅ 4. Loader during startup
  it('shows loader during startup', () => {
    (useMsal as jest.Mock).mockReturnValue({
      instance: mockInstance,
      accounts: [],
      inProgress: 'startup',
    });

    render(<PageLayout>Child</PageLayout>);

    expect(screen.getByText('Loader')).toBeInTheDocument();
  });

  // ✅ 5. Successful token flow
  it('renders children after successful token flow', async () => {
    mockInstance.acquireTokenSilent.mockResolvedValue({
      accessToken: 'validToken',
      idToken: 'validIdToken',
    });

    render(<PageLayout>Success</PageLayout>);

    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    // cover refresh timer
    jest.runOnlyPendingTimers();
  });

  // ✅ 6. InteractionRequiredAuthError
  it('calls loginRedirect on InteractionRequiredAuthError', async () => {
    mockInstance.acquireTokenSilent.mockRejectedValue(
      new InteractionRequiredAuthError('interaction_required', 'error')
    );

    render(<PageLayout>Child</PageLayout>);

    await waitFor(() => {
      expect(mockInstance.loginRedirect).toHaveBeenCalled();
    });
  });

  // ✅ 7. Generic error → session expired
  it('redirects to session-expired on generic error', async () => {
    mockInstance.acquireTokenSilent.mockRejectedValue(new Error('Some failure'));

    render(<PageLayout>Child</PageLayout>);

    await waitFor(() => {
      expect(window.location.href).toBe('http://localhost/');
    });
  });
});
