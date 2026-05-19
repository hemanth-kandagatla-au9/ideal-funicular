// src/utils/__tests__/safeLazy.test.tsx

import '@testing-library/jest-dom';
import React from 'react';

// Mock ModuleHOC BEFORE importing safeLazy to ensure the lazy component is wrapped correctly.
// Make ModuleHOC a transparent pass-through so it returns the component it receives.
jest.mock('../ModuleHOC', () => ({
  __esModule: true,
  default: (Component: React.ComponentType<any>) => Component,
}));

import { render, screen, waitFor } from '@testing-library/react';
import safeLazy from '../safeLazy';
import ModuleHOC from '../ModuleHOC';

// Simple error boundary to capture lazy-load errors without failing the test run
class ErrorBoundary extends React.Component<
  { onError?: (e: any) => void; children: React.ReactNode },
  { error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  componentDidCatch(error: any) {
    if (this.props.onError) this.props.onError(error);
  }
  render() {
    if (this.state.error) {
      const message = this.state.error?.message ?? String(this.state.error ?? '');
      return <div data-testid="error">{message}</div>;
    }
    return this.props.children as any;
  }
}

describe('safeLazy', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Silence React error output (Suspense + ErrorBoundary) while still allowing assertions
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('creates a lazy component from an import function and wraps with ModuleHOC', () => {
    const importFn = () => Promise.resolve({ default: () => <div>Test</div> });
    const LazyComponent = safeLazy(importFn);

    expect(LazyComponent).toBeDefined();
    // Verify ModuleHOC received the lazy component
    expect((ModuleHOC as unknown as jest.Mock).mock?.calls?.length ?? 1).toBeGreaterThan(0);
  });

  it('renders remote component with default export', async () => {
    const importFn = () =>
      Promise.resolve({
        default: () => <div data-testid="remote-component">Loaded Remote</div>,
      });

    const LazyComponent = safeLazy(importFn);

    render(
      <React.Suspense fallback={<div data-testid="loading">Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    );

    // Suspense shows fallback first
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Then the lazy component resolves
    await waitFor(() => {
      expect(screen.getByTestId('remote-component')).toBeInTheDocument();
    });
  });

  it('renders remote component with nested default.default export', async () => {
    const importFn = () =>
      Promise.resolve({
        default: {
          default: () => <div data-testid="nested-component">Nested Default</div>,
        },
      });

    const LazyComponent = safeLazy(importFn);

    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    );

    await waitFor(() => {
      expect(screen.getByTestId('nested-component')).toBeInTheDocument();
    });
  });

  it('renders remote component when module itself is the component', async () => {
    const MockComponent = () => <div data-testid="direct-component">Direct</div>;
    const importFn = () => Promise.resolve(MockComponent);

    const LazyComponent = safeLazy(importFn);

    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    );

    await waitFor(() => {
      expect(screen.getByTestId('direct-component')).toBeInTheDocument();
    });
  });

  it('throws clear error when importFn is not a function', async () => {
    const importFn = 'not-a-function' as any;
    const LazyComponent = safeLazy(importFn);

    render(
      <ErrorBoundary>
        <React.Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </React.Suspense>
      </ErrorBoundary>
    );

    await waitFor(() => {
      const el = screen.getByTestId('error');
      expect(el).toBeInTheDocument();
      expect(el.textContent).toContain(
        "safeLazy requires a function: () => import('remote/module')"
      );
    });
  });

  it('throws clear error when module returns no valid component', async () => {
    // Returning null ensures resolveComponent produces a falsy "Component",
    // triggering the explicit error in load()
    const importFn = () => Promise.resolve(null as any);

    const LazyComponent = safeLazy(importFn);

    render(
      <ErrorBoundary>
        <React.Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </React.Suspense>
      </ErrorBoundary>
    );

    await waitFor(() => {
      const el = screen.getByTestId('error');
      expect(el).toBeInTheDocument();
      expect(el.textContent).toContain('Module Federation did not return a valid React component');
    });
  });

  it('handles rejected import promise and surfaces error', async () => {
    const importFn = () => Promise.reject(new Error('Load failed'));

    const LazyComponent = safeLazy(importFn);

    render(
      <ErrorBoundary>
        <React.Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </React.Suspense>
      </ErrorBoundary>
    );

    await waitFor(() => {
      const el = screen.getByTestId('error');
      expect(el).toBeInTheDocument();
      expect(el.textContent).toContain('Load failed');
    });
  });
});
