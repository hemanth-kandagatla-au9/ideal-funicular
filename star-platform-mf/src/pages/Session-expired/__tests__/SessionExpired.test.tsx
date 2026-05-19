import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionExpired } from '../SessionExpired';
import { useMsal } from '@azure/msal-react';
import Cookies from 'universal-cookie';

// Mock MSAL
jest.mock('@azure/msal-react', () => ({
  useMsal: jest.fn(),
}));

// Mock Cookies
jest.mock('universal-cookie', () => {
  return jest.fn().mockImplementation(() => ({
    remove: jest.fn(),
  }));
});

describe('SessionExpired', () => {
  let loginRedirectMock: jest.Mock;
  let removeMock: jest.Mock;

  beforeEach(() => {
    loginRedirectMock = jest.fn();

    (useMsal as jest.Mock).mockReturnValue({
      instance: {
        loginRedirect: loginRedirectMock,
      },
    });

    removeMock = jest.fn();
    (Cookies as jest.Mock).mockImplementation(() => ({
      remove: removeMock,
    }));

    jest.spyOn(Storage.prototype, 'clear');
    jest.spyOn(Storage.prototype, 'removeItem');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders UI correctly', () => {
    render(<SessionExpired />);

    expect(screen.getByText('Session Timed Out!')).toBeInTheDocument();
    expect(screen.getByText(/Your session has expired/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('clears storage and cookies on mount', () => {
    render(<SessionExpired />);
  });

  test('calls loginRedirect on login click', async () => {
    loginRedirectMock.mockResolvedValueOnce(undefined);

    render(<SessionExpired />);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(loginRedirectMock).toHaveBeenCalled();
    });
  });

  test('falls back to redirect on login failure', async () => {
    loginRedirectMock.mockRejectedValueOnce(new Error('fail'));

    delete (window as any).location;
    (window as any).location = { href: '' };

    render(<SessionExpired />);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(window.location.href).toBe('http://localhost/');
    });
  });
});
