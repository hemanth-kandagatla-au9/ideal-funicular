import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppLayout } from '../Layout';

describe('AppLayout', () => {
  it('should render without crashing', () => {
    const { container } = render(<AppLayout />);
    expect(container).toBeInTheDocument();
  });

  it('should render children when provided', () => {
    render(
      <AppLayout>
        <div data-testid="test-child">Test Child</div>
      </AppLayout>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toHaveTextContent('Test Child');
  });

  it('should render multiple children', () => {
    render(
      <AppLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </AppLayout>
    );
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('should render without children', () => {
    const { container } = render(<AppLayout />);
    const remoteContent = container.querySelector('[class*="remote-content"]');
    expect(remoteContent).toBeInTheDocument();
  });

  it('should have remote-content class', () => {
    const { container } = render(<AppLayout />);
    const remoteContent = container.querySelector('[class*="remote-content"]');
    expect(remoteContent).toBeInTheDocument();
  });

  it('should render children inside remote-content div', () => {
    const { container } = render(
      <AppLayout>
        <span data-testid="nested-child">Nested</span>
      </AppLayout>
    );
    const remoteContent = container.querySelector('[class*="remote-content"]');
    const child = screen.getByTestId('nested-child');
    expect(remoteContent).toContainElement(child);
  });

  it('should accept React elements as children', () => {
    const TestComponent = () => <div data-testid="component">Component</div>;
    render(
      <AppLayout>
        <TestComponent />
      </AppLayout>
    );
    expect(screen.getByTestId('component')).toBeInTheDocument();
  });

  it('should accept text as children', () => {
    render(<AppLayout>Plain text content</AppLayout>);
    expect(screen.getByText('Plain text content')).toBeInTheDocument();
  });

  it('should handle null children', () => {
    const { container } = render(<AppLayout>{null}</AppLayout>);
    const remoteContent = container.querySelector('[class*="remote-content"]');
    expect(remoteContent).toBeInTheDocument();
    expect(remoteContent).toBeEmptyDOMElement();
  });

  it('should handle undefined children', () => {
    const { container } = render(<AppLayout>{undefined}</AppLayout>);
    const remoteContent = container.querySelector('[class*="remote-content"]');
    expect(remoteContent).toBeInTheDocument();
    expect(remoteContent).toBeEmptyDOMElement();
  });

  it('should render with complex nested structure', () => {
    render(
      <AppLayout>
        <div>
          <header data-testid="header">Header</header>
          <main data-testid="main">Main Content</main>
          <footer data-testid="footer">Footer</footer>
        </div>
      </AppLayout>
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('main')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
