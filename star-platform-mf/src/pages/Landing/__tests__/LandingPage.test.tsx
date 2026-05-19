import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingPage from '../LandingPage';

// Mock getUserPermissions
jest.mock('../../../services/userServices', () => ({
  getUserPermissions: jest.fn().mockResolvedValue({ permissions: [] }),
}));

// Mock Dashboard component
jest.mock('../../../components/Dashboard/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="mock-dashboard">Dashboard</div>;
  };
});

// Mock universal-cookie
jest.mock('universal-cookie');

describe('LandingPage', () => {
  it('should render the landing container', () => {
    const { container } = render(<LandingPage />);
    const landingContainer = container.querySelector('[class*="landingContainer"]');
    expect(landingContainer).toBeInTheDocument();
  });

  it('should render the bottom section', () => {
    const { container } = render(<LandingPage />);
    const bottomSection = container.querySelector('[class*="bottomSection"]');
    expect(bottomSection).toBeInTheDocument();
  });
});
