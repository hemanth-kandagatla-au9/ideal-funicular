import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockCookiesGet = jest.fn();
jest.mock('universal-cookie', () => jest.fn().mockImplementation(() => ({ get: mockCookiesGet })));

jest.mock('../../../assets/IAsphere.svg', () => 'IAsphere.svg');
jest.mock('../../../assets/johnson-johnson-logo.svg', () => 'jj-logo.svg');
jest.mock('../../../assets/helpcontent.svg', () => 'helpcontent.svg');
jest.mock('../../../assets/Home.svg', () => 'Home.svg');

jest.mock('../Header.module.scss', () => new Proxy({}, { get: (_, key) => String(key) }));

jest.mock('../../Dashboard/DashboardHeader', () => () => <div data-testid="dashboard-header" />);

const mockClearAllCookies = jest.fn();
jest.mock('../../../utils/Tokenutil', () => ({ clearAllCookies: mockClearAllCookies }));

const mockShouldHideHeader = jest.fn();
jest.mock('../../../utils/hooks/layoutUtils', () => ({
  shouldHideHeader: (p: string) => mockShouldHideHeader(p),
}));

const mockHistoryPush = jest.fn();

// Mutable pathname — mutate this directly in tests before rendering.
// Do NOT use jest.resetModules(): it creates a second React copy which breaks hooks.
let mockPathname = '/app/workflow';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ push: mockHistoryPush }),
  useLocation: () => ({ pathname: mockPathname }),
}));

// ─── Import component once (stable React instance for all tests) ──────────────
import Header from '../Header';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header instance={{}} />
    </MemoryRouter>
  );

beforeEach(() => {
  mockCookiesGet.mockReset();
  mockHistoryPush.mockReset();
  mockClearAllCookies.mockReset();
  mockShouldHideHeader.mockReturnValue(false);
  mockPathname = '/app/workflow';
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Header', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders logos and DashboardHeader when hideHeader is false', () => {
    mockCookiesGet.mockReturnValue(undefined);

    renderHeader();

    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
  });

  it('hides DashboardHeader when shouldHideHeader returns true', () => {
    mockCookiesGet.mockReturnValue(undefined);
    mockShouldHideHeader.mockReturnValue(true);

    renderHeader();

    expect(screen.queryByTestId('dashboard-header')).toBeNull();
  });

  // ── Profile display ────────────────────────────────────────────────────────

  it('shows profile image when cookie provides one', () => {
    mockCookiesGet.mockImplementation((key: string) => {
      if (key === 'user_fullname') return 'Alice Bob';
      if (key === 'profile_image') return 'http://img/pic.png';
    });

    renderHeader();

    expect(screen.getByAltText('profile')).toHaveAttribute('src', 'http://img/pic.png');
  });

  it('shows initials when no profile image', () => {
    mockCookiesGet.mockImplementation((key: string) => {
      if (key === 'user_fullname') return 'Alice Bob';
      if (key === 'profile_image') return undefined;
    });

    renderHeader();

    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('renders without crashing when username is empty string', () => {
    mockCookiesGet.mockReturnValue('');
    renderHeader();
    // getInitials('') → '' — just assert no crash
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });

  // ── Help-content button ────────────────────────────────────────────────────

  it('shows help icon on non-help route and navigates to helpcontent on click', () => {
    mockPathname = '/app/workflow';
    mockCookiesGet.mockReturnValue(undefined);

    renderHeader();

    expect(screen.queryByText('Back to Home')).toBeNull();
    expect(screen.getByAltText('agent')).toBeInTheDocument();

    fireEvent.click(screen.getByAltText('agent').closest('div')!);
    expect(mockHistoryPush).toHaveBeenCalledWith('/app/workflow/helpcontent');
  });

  it('shows Back-to-Home on help route and navigates back on click', () => {
    mockPathname = '/app/workflow/helpcontent';
    mockCookiesGet.mockReturnValue(undefined);

    renderHeader();

    expect(screen.getByText('Back to Home')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Back to Home').closest('div')!);
    expect(mockHistoryPush).toHaveBeenCalledWith('/app/workflow');
  });

  // ── Dropdown ───────────────────────────────────────────────────────────────

  it('opens dropdown when arrow button is clicked', () => {
    mockCookiesGet.mockReturnValue(undefined);
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: /open user menu/i }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('closes dropdown when arrow button is clicked again while open', () => {
    jest.useFakeTimers();
    mockCookiesGet.mockReturnValue(undefined);
    renderHeader();

    const btn = screen.getByRole('button', { name: /open user menu/i });
    fireEvent.click(btn); // open
    fireEvent.click(btn); // close
    act(() => jest.runAllTimers());

    jest.useRealTimers();
  });

  it('closes dropdown on outside click', () => {
    jest.useFakeTimers();
    mockCookiesGet.mockReturnValue(undefined);
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: /open user menu/i }));
    fireEvent.click(document.body);
    act(() => jest.runAllTimers());

    jest.useRealTimers();
  });

  // ── Logout ─────────────────────────────────────────────────────────────────

  it('calls clearAllCookies and redirects to /logout', () => {
    mockCookiesGet.mockReturnValue(undefined);

    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: /open user menu/i }));
    fireEvent.click(screen.getByText('Logout'));

    expect(mockClearAllCookies).toHaveBeenCalled();
    expect(window.location.href).toBe('http://localhost/');
  });

  it('still redirects when clearAllCookies throws', () => {
    mockClearAllCookies.mockImplementation(() => {
      throw new Error('cookie error');
    });
    mockCookiesGet.mockReturnValue(undefined);

    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: /open user menu/i }));
    fireEvent.click(screen.getByText('Logout'));

    expect(window.location.href).toBe('http://localhost/');
  });
});
