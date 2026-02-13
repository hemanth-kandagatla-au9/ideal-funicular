import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { safeLazy } from '../safeLazy';
import { loadRemoteModule } from '../loadRemoteModule';

// Mock loadRemoteModule
jest.mock('../loadRemoteModule');

// Mock ModuleHOC to pass through the component
jest.mock('../ModuleHOC', () => {
  return function ModuleHOC(Component) {
    return Component;
  };
});

describe('safeLazy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a lazy component', () => {
    const LazyComponent = safeLazy('testRemote', 'http://localhost:3002', './TestModule');

    expect(LazyComponent).toBeDefined();
  });

  it('should render remote component successfully', async () => {
    const mockModule = {
      default: () => <div data-testid="remote-component">Loaded Remote</div>,
    };
    (loadRemoteModule as jest.Mock).mockResolvedValue(mockModule);

    const LazyComponent = safeLazy('testRemote', 'http://localhost:3002', './TestModule');

    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    );

    await waitFor(() => {
      expect(screen.getByTestId('remote-component')).toBeInTheDocument();
    });
  });

  it('should show fallback UI when loading fails', async () => {
    (loadRemoteModule as jest.Mock).mockRejectedValue(new Error('Load failed'));

    const LazyComponent = safeLazy('failRemote', 'http://localhost:3003', './FailModule');

    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load remote module/i)).toBeInTheDocument();
    });
  });

  it('should display correct error message in fallback', async () => {
    (loadRemoteModule as jest.Mock).mockRejectedValue(new Error('Network error'));

    const LazyComponent = safeLazy('errorRemote', 'http://localhost:3004', './ErrorModule');

    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    );

    await waitFor(() => {
      const errorMsg = screen.getByText(/Failed to load remote module. Please try again later./i);
      expect(errorMsg).toBeInTheDocument();
    });
  });

  it('should render error fallback as div element', async () => {
    (loadRemoteModule as jest.Mock).mockRejectedValue(new Error('Styling test'));

    const LazyComponent = safeLazy('styleRemote', 'http://localhost:3005', './StyleModule');

    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    );

    await waitFor(() => {
      const errorDiv = screen.getByText(/Failed to load remote module/i);
      expect(errorDiv).toBeInTheDocument();
      expect(errorDiv.tagName).toBe('DIV');
    });
  });

  it('should call loadRemoteModule with correct parameters', async () => {
    const mockModule = {
      default: () => <div>Test</div>,
    };
    (loadRemoteModule as jest.Mock).mockResolvedValue(mockModule);

    const remoteName = 'myRemote';
    const remoteUrl = 'http://localhost:4000';
    const modulePath = './MyModule';

    safeLazy(remoteName, remoteUrl, modulePath);

    // Render to trigger the lazy load
    const LazyComponent = safeLazy(remoteName, remoteUrl, modulePath);
    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    );

    await waitFor(() => {
      expect(loadRemoteModule).toHaveBeenCalledWith(remoteName, remoteUrl, modulePath);
    });
  });
});
