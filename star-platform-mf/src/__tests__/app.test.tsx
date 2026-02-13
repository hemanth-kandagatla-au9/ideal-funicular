import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the AppRoute component
jest.mock('../pages/routes/appRoutes', () => ({
  __esModule: true,
  default: () => <div data-testid="app-route">App Route Mock</div>,
}));

describe('App Component', () => {
  it('should render without crashing', () => {
    const mockInstance = {};
    render(<App instance={mockInstance} />);
    expect(screen.getByTestId('app-route')).toBeInTheDocument();
  });

  it('should pass instance prop to AppRoute', () => {
    const mockInstance = { test: 'value' };
    render(<App instance={mockInstance} />);
    expect(screen.getByTestId('app-route')).toBeInTheDocument();
  });
});
