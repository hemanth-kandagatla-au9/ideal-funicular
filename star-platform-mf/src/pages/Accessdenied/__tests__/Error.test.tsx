import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Error from '../Error';

// Mock the SVG asset
jest.mock('../../assets/ApiError.svg', () => 'mocked-api-error.svg');

describe('Error Component', () => {
  beforeEach(() => {
    delete (window as any).location;
    (window as any).location = { href: 'http://localhost/' };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(<Error />);
  });

  it('renders the ApiError image with correct alt text', () => {
    render(<Error />);
    const img = screen.getByAltText('Api Error');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'mocked-api-error.svg');
  });

  it('renders the primary error heading', () => {
    render(<Error />);
    expect(screen.getByText('Failed to load permissions.')).toBeInTheDocument();
  });

  it('renders the support message', () => {
    render(<Error />);
    expect(
      screen.getByText('If this persists, please refresh the page or contact support.')
    ).toBeInTheDocument();
  });

  it('renders the Refresh button', () => {
    render(<Error />);
    const button = screen.getByRole('button', { name: /refresh/i });
    expect(button).toBeInTheDocument();
  });

  it('navigates to "/" when Refresh button is clicked', () => {
    render(<Error />);
    const button = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(button);
    expect(window.location.href).toContain('/');
  });

  it('applies correct styles to the container div', () => {
    const { container } = render(<Error />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '65vh',
      flexDirection: 'column',
      gap: '2px',
    });
  });

  it('applies correct styles to the Refresh button', () => {
    render(<Error />);
    const button = screen.getByRole('button', { name: /refresh/i });
    expect(button).toHaveStyle({ padding: '8px' });
    expect(button).toHaveStyle({ color: 'rgb(255, 255, 255)' });
    expect(button).toHaveStyle({ borderRadius: '16px' });
  });

  it('renders h4 tag for the primary error message', () => {
    const { container } = render(<Error />);
    const h4 = container.querySelector('h4');
    expect(h4).toBeInTheDocument();
    expect(h4).toHaveTextContent('Failed to load permissions.');
  });

  it('renders h5 tag for the support message', () => {
    const { container } = render(<Error />);
    const h5 = container.querySelector('h5');
    expect(h5).toBeInTheDocument();
    expect(h5).toHaveTextContent('If this persists, please refresh the page or contact support.');
  });

  it('renders the button with correct background color', () => {
    render(<Error />);
    const button = screen.getByRole('button', { name: /refresh/i });
    expect(button).toHaveStyle({ background: 'rgb(41, 97, 244)' });
  });

  it('renders the img element inside the container', () => {
    const { container } = render(<Error />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Api Error');
  });
});
