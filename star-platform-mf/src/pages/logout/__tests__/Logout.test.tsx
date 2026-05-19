import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Logout from '../Logout';
import { useMsal } from '@azure/msal-react';
import { clearAllCookies } from '../../../utils/Tokenutil';

// Mocks
jest.mock('@azure/msal-react');
jest.mock('../../../utils/Tokenutil');

describe('Logout Component', () => {
  const mockInitialize = jest.fn();
  const mockLoginRedirect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useMsal as jest.Mock).mockReturnValue({
      instance: {
        initialize: mockInitialize,
        loginRedirect: mockLoginRedirect,
      },
    });

    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  test('renders component and clears cookies', () => {
    render(<Logout />);

    expect(clearAllCookies).toHaveBeenCalled();
  });

  test('calls loginRedirect when authority exists', async () => {
    process.env.REACT_APP_AUTHORITY_URL = 'https://auth-url';

    render(<Logout />);
    fireEvent.click(screen.getByText(/go to login/i));

    await waitFor(() => {
      expect(mockInitialize).toHaveBeenCalled();
      expect(mockLoginRedirect).toHaveBeenCalled();
    });
  });

  test('fallback to app route when authority missing', async () => {
    process.env.REACT_APP_AUTHORITY_URL = '';

    render(<Logout />);
    fireEvent.click(screen.getByText(/go to login/i));

    await waitFor(() => {
      expect(window.location.href).toBe('http://localhost/');
    });
  });

  test('fallback when loginRedirect throws error', async () => {
    process.env.REACT_APP_AUTHORITY_URL = 'https://auth-url';

    mockLoginRedirect.mockRejectedValueOnce(new Error('fail'));

    render(<Logout />);
    fireEvent.click(screen.getByText(/go to login/i));

    await waitFor(() => {
      expect(window.location.href).toBe('http://localhost/');
    });
  });
});
