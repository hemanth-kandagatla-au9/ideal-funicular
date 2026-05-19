import React from 'react';
import { render, act } from '@testing-library/react';
import { usePermissionLoader } from '../usePermissionLoader';
import { useDispatch, useSelector } from 'react-redux';
import { setPermissions, setPermissionsError } from '../../../redux/slices/permissionSlice';
import { getUserPermissions } from '../../../services/userServices';
import { normalizePermissions } from '../../permissionUtil';
import { authBootstrapState } from '../../AuthBootstrap';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../../services/userServices', () => ({
  getUserPermissions: jest.fn(),
}));

jest.mock('../../permissionUtil', () => ({
  normalizePermissions: jest.fn(),
}));

jest.mock('../../../redux/slices/permissionSlice', () => ({
  setPermissions: jest.fn(),
  setPermissionsError: jest.fn(),
}));

describe('usePermissionLoader (without renderHook)', () => {
  const dispatchMock = jest.fn();

  const TestComponent = ({ enabled = true }: { enabled?: boolean }) => {
    usePermissionLoader(enabled);
    return null;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useDispatch as jest.Mock).mockReturnValue(dispatchMock);

    (useSelector as jest.Mock).mockImplementation((cb) =>
      cb({
        permissions: {
          permissions: [],
          loaded: false,
        },
      })
    );

    authBootstrapState.ready = true;
  });

  // ✅ 1. Happy path
  it('should fetch and set permissions when ready', async () => {
    (getUserPermissions as jest.Mock).mockResolvedValue(['A']);
    (normalizePermissions as jest.Mock).mockReturnValue(['NORM']);

    await act(async () => {
      render(<TestComponent />);
    });

    expect(getUserPermissions).toHaveBeenCalled();
    expect(normalizePermissions).toHaveBeenCalledWith(['A']);
    expect(dispatchMock).toHaveBeenCalledWith(setPermissions(['NORM'] as any));
  });

  // ✅ 2. API returns null
  it('should not dispatch when API returns null', async () => {
    (getUserPermissions as jest.Mock).mockResolvedValue(null);

    await act(async () => {
      render(<TestComponent />);
    });

    expect(dispatchMock).not.toHaveBeenCalled();
  });

  // ✅ 3. API error
  it('should handle API error', async () => {
    (getUserPermissions as jest.Mock).mockRejectedValue(new Error('fail'));

    await act(async () => {
      render(<TestComponent />);
    });

    expect(dispatchMock).toHaveBeenCalledWith(setPermissionsError());
  });

  // ✅ 4. disabled
  it('should not fetch when disabled', async () => {
    await act(async () => {
      render(<TestComponent enabled={false} />);
    });

    expect(getUserPermissions).not.toHaveBeenCalled();
  });

  // ✅ 5. event trigger
  it('should wait for IAS_AUTH_READY event', async () => {
    authBootstrapState.ready = false;

    (getUserPermissions as jest.Mock).mockResolvedValue(['A']);
    (normalizePermissions as jest.Mock).mockReturnValue(['NORM']);

    render(<TestComponent />);

    await act(async () => {
      window.dispatchEvent(new Event('IAS_AUTH_READY'));
    });

    expect(getUserPermissions).toHaveBeenCalled();
  });

  // ✅ 6. prevent duplicate calls
  it('should not fetch multiple times', async () => {
    (getUserPermissions as jest.Mock).mockResolvedValue(['A']);
    (normalizePermissions as jest.Mock).mockReturnValue(['NORM']);

    const { rerender } = render(<TestComponent />);

    await act(async () => {});

    rerender(<TestComponent />);

    expect(getUserPermissions).toHaveBeenCalledTimes(1);
  });
});
