import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom';
import BinaryVersionsHeader from '../../../../../layouts/agent-management/components/versionmanagement/BinaryVersionsHeader';

describe('BinaryVersionsHeader Component', () => {
  const mockOnSync = jest.fn();
  let history: any;

  beforeEach(() => {
    jest.clearAllMocks();
    history = createMemoryHistory();
    history.push('/some-path');
  });

  const renderComponent = (versionsCount = 5, isLoading = false) => {
    return render(
      <Router history={history}>
        <BinaryVersionsHeader
          versionsCount={versionsCount}
          onSync={mockOnSync}
          isLoading={isLoading}
        />
      </Router>
    );
  };

  test('renders header with title and version count', () => {
    renderComponent(10);
    
    expect(screen.getByText('Binary Versions')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('renders with zero versions', () => {
    renderComponent(0);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('renders sync versions button', () => {
    renderComponent();
    
    expect(screen.getByText('Sync Versions')).toBeInTheDocument();
  });

  test('calls onSync when sync button is clicked', () => {
    renderComponent();
    
    fireEvent.click(screen.getByText('Sync Versions'));
    
    expect(mockOnSync).toHaveBeenCalledTimes(1);
  });

  test('shows loading state', () => {
    renderComponent(5, true);
    
    expect(screen.getByText('Syncing...')).toBeInTheDocument();
  });

  test('disables sync button when loading', () => {
    renderComponent(5, true);
    
    const syncButton = screen.getByRole('button', { name: /syncing/i });
    expect(syncButton).toBeDisabled();
  });
});



