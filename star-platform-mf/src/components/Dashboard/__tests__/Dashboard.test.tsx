import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { createMockStore } from '../../../__mocks__/storeMock';

// Mock CSS module
jest.mock('../css/dashboard.module.scss', () => ({
  platformDashboard: 'platformDashboard',
}));

describe('Dashboard Component', () => {
  const renderDashboard = (initialState = {}) => {
    const store = createMockStore(initialState);

    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render dashboard component', () => {
    const { container } = renderDashboard();

    const dashboard = container.querySelector('.platformDashboard');
    expect(dashboard).toBeInTheDocument();
  });

  it('should render with custom state from Redux', () => {
    const mockState = {
      dashboard: {
        data: 'test data',
      },
    };

    const { container } = renderDashboard(mockState);

    const dashboard = container.querySelector('.platformDashboard');
    expect(dashboard).toBeInTheDocument();
  });

  it('should handle empty state gracefully', () => {
    const { container } = renderDashboard({});

    const dashboard = container.querySelector('.platformDashboard');
    expect(dashboard).toBeInTheDocument();
  });

  it('should render as a React component without errors', () => {
    expect(() => renderDashboard()).not.toThrow();
  });
});
