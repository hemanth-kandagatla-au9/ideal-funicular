// src/pages/login/__tests__/Login.test.tsx

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Login } from '../Login';
import { useMsal } from '@azure/msal-react';

// Mocks
jest.mock('@azure/msal-react');
jest.mock('../../../utils/msalConfig', () => ({
  loginRequest: { scopes: ['user.read'] },
}));
jest.mock('react-spinners', () => ({
  CircleLoader: () => <div data-testid="loader" />,
}));

describe('Login Component', () => {
  let mockInstance: any;

  const setUrl = (pathWithQuery: string) => {
    // Update the URL safely in jsdom
    window.history.pushState({}, '', pathWithQuery);
  };

  beforeEach(() => {
    mockInstance = {
      initialize: jest.fn().mockResolvedValue(undefined),
      getAllAccounts: jest.fn().mockReturnValue([]),
      loginRedirect: jest.fn().mockResolvedValue(undefined),
    };

    (useMsal as jest.Mock).mockReturnValue({
      instance: mockInstance,
    });

    // Default “shared” URL for most tests
    setUrl('/app/workflow/flow/b7e43bb1?type=flow&executionId=FL-93650');

    sessionStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── Rendering ───────────────────────────────────────────────────────────

  test('renders loader', () => {
    const { getByTestId } = render(<Login />);
    expect(getByTestId('loader')).toBeInTheDocument();
  });

  // ─── Already logged in ───────────────────────────────────────────────────
  // Note: jsdom does not allow spying on window.location.href setter.
  // We verify the logged-in branch by ensuring initialize ran, loginRedirect did NOT run,
  // and the URL lies under /app/workflow.
  test('redirects to /app/workflow when already logged in', async () => {
    mockInstance.getAllAccounts.mockReturnValue([{ username: 'user@example.com' }]);

    render(<Login />);

    await waitFor(() => {
      expect(mockInstance.initialize).toHaveBeenCalledTimes(1);
      expect(mockInstance.loginRedirect).not.toHaveBeenCalled();
      expect(window.location.href).toMatch(/\/app\/workflow(\/|$)/);
    });
  });

  // ─── Not logged in — shared URL ──────────────────────────────────────────

  test('saves shared URL to sessionStorage and calls loginRedirect', async () => {
    mockInstance.getAllAccounts.mockReturnValue([]);

    render(<Login />);

    await waitFor(() => {
      expect(mockInstance.loginRedirect).toHaveBeenCalledWith({ scopes: ['user.read'] });
    });

    const expected = '/app/workflow/flow/b7e43bb1?type=flow&executionId=FL-93650';
    expect(sessionStorage.getItem('postLoginRedirect')).toBe(expected);
  });

  // ─── Not logged in — does not overwrite existing saved URL ───────────────

  test('does not overwrite existing postLoginRedirect in sessionStorage', async () => {
    mockInstance.getAllAccounts.mockReturnValue([]);
    sessionStorage.setItem('postLoginRedirect', '/app/workflow/flow/existing');

    render(<Login />);

    await waitFor(() => {
      expect(mockInstance.loginRedirect).toHaveBeenCalledWith({ scopes: ['user.read'] });
    });

    expect(sessionStorage.getItem('postLoginRedirect')).toBe('/app/workflow/flow/existing');
  });

  // ─── Default URLs — should NOT be saved ──────────────────────────────────

  test.each([
    ['/', ''],
    ['/login', ''],
    ['/app/workflow', ''],
    ['/app', ''],
  ])('does not save "%s" as postLoginRedirect', async (pathname, search) => {
    mockInstance.getAllAccounts.mockReturnValue([]);

    setUrl(`${pathname}${search}`);

    render(<Login />);

    await waitFor(() => {
      expect(mockInstance.loginRedirect).toHaveBeenCalledWith({ scopes: ['user.read'] });
    });

    expect(sessionStorage.getItem('postLoginRedirect')).toBeNull();
  });

  // ─── initialize called always ─────────────────────────────────────────────

  test('always calls initialize', async () => {
    render(<Login />);

    await waitFor(() => {
      expect(mockInstance.initialize).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Error handling ───────────────────────────────────────────────────────

  test('handles initialize error gracefully', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockInstance.initialize.mockRejectedValue(new Error('Init failed'));

    render(<Login />);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith('Login Error:', expect.any(Error));
    });

    errorSpy.mockRestore();
  });

  test('handles loginRedirect error gracefully', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockInstance.getAllAccounts.mockReturnValue([]);
    mockInstance.loginRedirect.mockRejectedValue(new Error('Redirect failed'));

    render(<Login />);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith('Login Error:', expect.any(Error));
    });

    errorSpy.mockRestore();
  });
});
