import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error and console.log for cleaner test output
  const originalError = console.error;
  const originalLog = console.log;

  beforeAll(() => {
    console.error = jest.fn();
    console.log = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
    console.log = originalLog;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child Component</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('should render fallback UI when showFallbackUI is true and error occurs', () => {
    render(
      <ErrorBoundary showFallbackUI={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Failed to load.')).toBeInTheDocument();
    expect(screen.queryByText('No error')).not.toBeInTheDocument();
  });

  it('should render nothing when showFallbackUI is false and error occurs', () => {
    const { container } = render(
      <ErrorBoundary showFallbackUI={false}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should render empty (null)
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when showFallbackUI is undefined and error occurs', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should render empty (null) because showFallbackUI defaults to undefined
    expect(container.firstChild).toBeNull();
  });

  it('should call getDerivedStateFromError when error is thrown', () => {
    const spy = jest.spyOn(ErrorBoundary, 'getDerivedStateFromError');

    render(
      <ErrorBoundary showFallbackUI={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(spy).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      'Error caught by getDerivedStateFromError: ',
      expect.any(Error)
    );
    
    spy.mockRestore();
  });

  it('should call componentDidCatch when error is thrown', () => {
    render(
      <ErrorBoundary showFallbackUI={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.log).toHaveBeenCalledWith(
      'Error caught by ErrorBoundary: ',
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('should have correct styling for fallback UI', () => {
    render(
      <ErrorBoundary showFallbackUI={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const fallbackElement = screen.getByText('Failed to load.');
    expect(fallbackElement).toHaveStyle({
      textAlign: 'center',
      color: '#FF8500'
    });
    expect(fallbackElement.tagName).toBe('H4');
  });

  it('should maintain error state after catching error', () => {
    const { rerender } = render(
      <ErrorBoundary showFallbackUI={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // First render should show error
    expect(screen.getByText('Failed to load.')).toBeInTheDocument();

    // Rerender should still show error (hasError state persists)
    rerender(
      <ErrorBoundary showFallbackUI={true}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Failed to load.')).toBeInTheDocument();
  });
});
