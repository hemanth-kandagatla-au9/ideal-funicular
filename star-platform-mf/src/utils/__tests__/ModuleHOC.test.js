import React from 'react';
import { render, screen } from '@testing-library/react';
import ModuleHOC from '../ModuleHOC';

// Mock NotFound component
jest.mock('../../pages/NotFound/NotFound', () => {
  return function NotFound() {
    return <div data-testid="not-found">Not Found Page</div>;
  };
});

// Mock CircleLoader
jest.mock('react-spinners', () => ({
  CircleLoader: function CircleLoader() {
    return <div data-testid="circle-loader">Loading...</div>;
  },
}));

describe('ModuleHOC', () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  const TestComponent = () => <div data-testid="test-component">Test Component</div>;

  it('should wrap component with error boundary and suspense', () => {
    const WrappedComponent = ModuleHOC(TestComponent);
    render(<WrappedComponent />);

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('should render NotFound when component throws error', () => {
    const ThrowErrorComponent = () => {
      throw new Error('Test error');
    };

    const WrappedComponent = ModuleHOC(ThrowErrorComponent);
    render(<WrappedComponent />);

    expect(screen.getByTestId('not-found')).toBeInTheDocument();
    expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
  });

  it('should pass props to wrapped component', () => {
    const PropsComponent = ({ text }) => <div data-testid="props-component">{text}</div>;
    const WrappedComponent = ModuleHOC(PropsComponent);

    render(<WrappedComponent text="Hello Props" />);

    expect(screen.getByTestId('props-component')).toBeInTheDocument();
    expect(screen.getByText('Hello Props')).toBeInTheDocument();
  });

  it('should handle multiple wrapped components independently', () => {
    const Component1 = () => <div data-testid="component-1">Component 1</div>;
    const Component2 = () => <div data-testid="component-2">Component 2</div>;

    const Wrapped1 = ModuleHOC(Component1);
    const Wrapped2 = ModuleHOC(Component2);

    const { rerender } = render(<Wrapped1 />);
    expect(screen.getByTestId('component-1')).toBeInTheDocument();

    rerender(<Wrapped2 />);
    expect(screen.getByTestId('component-2')).toBeInTheDocument();
  });

  it('should maintain error boundary state', () => {
    let shouldThrow = true;
    const ConditionalErrorComponent = () => {
      if (shouldThrow) {
        throw new Error('Conditional error');
      }
      return <div data-testid="success">Success</div>;
    };

    const WrappedComponent = ModuleHOC(ConditionalErrorComponent);
    const { rerender } = render(<WrappedComponent />);

    // First render should show NotFound
    expect(screen.getByTestId('not-found')).toBeInTheDocument();

    // Even if we change shouldThrow, error boundary state persists
    shouldThrow = false;
    rerender(<WrappedComponent />);
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });
});
