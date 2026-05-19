import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

jest.mock('../pages/routes/appRoutes', () => ({
  __esModule: true,
  default: () => <div data-testid="app-route">App Route Mock</div>,
}));

jest.mock('../utils/hooks/usePermissionLoader', () => ({
  usePermissionLoader: jest.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as any).__WORKFLOW_PERMISSIONS__;
    delete (window as any).__WORKFLOW_PERMISSIONS_READY__;
  });

  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <App instance={{}} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('app-route')).toBeInTheDocument();
  });

  it('should render correctly without instance prop', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('app-route')).toBeInTheDocument();
  });

  it('should call usePermissionLoader with true on normal routes', () => {
    const { usePermissionLoader } = require('../utils/hooks/usePermissionLoader');
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );
    expect(usePermissionLoader).toHaveBeenCalledWith(true);
  });

  it('should call usePermissionLoader with false on /session-expired', () => {
    const { usePermissionLoader } = require('../utils/hooks/usePermissionLoader');
    render(
      <MemoryRouter initialEntries={['/session-expired']}>
        <App />
      </MemoryRouter>
    );
    expect(usePermissionLoader).toHaveBeenCalledWith(false);
  });

  it('should call usePermissionLoader with false on /logout', () => {
    const { usePermissionLoader } = require('../utils/hooks/usePermissionLoader');
    render(
      <MemoryRouter initialEntries={['/logout']}>
        <App />
      </MemoryRouter>
    );
    expect(usePermissionLoader).toHaveBeenCalledWith(false);
  });

  it('should handle WORKFLOW_PERMISSIONS_READY message event', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const payload = { permissions: ['read', 'write'] };
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'WORKFLOW_PERMISSIONS_READY', payload },
        })
      );
    });
    expect((window as any).__WORKFLOW_PERMISSIONS__).toEqual(payload);
    expect((window as any).__WORKFLOW_PERMISSIONS_READY__).toBe(true);
  });

  it('should ignore message events with different types', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'SOME_OTHER_EVENT', payload: {} },
        })
      );
    });
    expect((window as any).__WORKFLOW_PERMISSIONS_READY__).toBeUndefined();
  });

  it('should remove message event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('should log warning when offline event fires', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(consoleWarnSpy).toHaveBeenCalledWith('NETWORK_STATUS: OFFLINE');
    consoleWarnSpy.mockRestore();
  });

  // ✅ Covers lines 17-22 — online listener registered at module level
  // reload cannot be mocked after module load, so we suppress the jsdom
  // "not implemented" error and just verify console.warn was called
  it('should log warning when online event fires', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(consoleWarnSpy).toHaveBeenCalledWith('NETWORK_STATUS: ONLINE');
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  // ✅ Covers lines 9, 17-22 — window error event with Loading script failed
  it('should handle Loading script failed error event', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    act(() => {
      const errorEvent = new ErrorEvent('error', {
        message: 'Loading script failed for ./remoteEntry.js',
      });
      window.dispatchEvent(errorEvent);
    });

    expect(root.innerHTML).toContain('Remote Application Not Running');
    expect(root.innerHTML).toContain('Please start the remote server.');

    document.body.removeChild(root);
    consoleErrorSpy.mockRestore();
  });

  // ✅ Covers error event that does NOT match Loading script failed
  it('should ignore error events without Loading script failed message', () => {
    const root = document.createElement('div');
    root.id = 'root';
    root.innerHTML = '<p>original content</p>';
    document.body.appendChild(root);

    act(() => {
      const errorEvent = new ErrorEvent('error', {
        message: 'Some other error',
      });
      window.dispatchEvent(errorEvent);
    });

    // root should be unchanged
    expect(root.innerHTML).toBe('<p>original content</p>');
    document.body.removeChild(root);
  });

  // ✅ Covers error event when root element does not exist
  it('should handle Loading script failed when root element is missing', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // Make sure no root element exists
    const existingRoot = document.getElementById('root');
    if (existingRoot) existingRoot.remove();

    act(() => {
      const errorEvent = new ErrorEvent('error', {
        message: 'Loading script failed for ./remoteEntry.js',
      });
      window.dispatchEvent(errorEvent);
    });

    // Should not throw — just silently skip the innerHTML update
    expect(consoleErrorSpy).toHaveBeenCalledWith('[REMOTE ERROR] Remote script failed to load');
    consoleErrorSpy.mockRestore();
  });
});
