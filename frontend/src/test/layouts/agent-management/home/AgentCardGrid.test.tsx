import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentCardGrid, { AgentMetricsTile } from '../../../../layouts/agent-management/home/AgentCardGrid';

// Mock the Skeleton component to have a test-id
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Skeleton: (props: any) => <div data-testid="skeleton" {...props} />,
}));

describe('AgentCardGrid Component', () => {
  const mockAgentMetricsTilesData: AgentMetricsTile[] = [
    { name: 'Active', count: 5 },
    { name: 'Inactive', count: 3 },
    { name: 'Failed', count: 2 },
  ];
  const mockOnSelectStatus = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('renders cards after loading completes', () => {
    render(
      <AgentCardGrid
        agentMetricsTilesData={mockAgentMetricsTilesData} 
        onSelectStatus={mockOnSelectStatus} 
      />
    );

    // Advance timers to complete loading
    jest.advanceTimersByTime(1000);

    // Should show 4 cards with proper labels
    expect(screen.getByText('All Servers')).toBeInTheDocument();
    expect(screen.getByText('Active Servers')).toBeInTheDocument();
    expect(screen.getByText('Inactive Servers')).toBeInTheDocument();
    expect(screen.getByText('Failed Servers')).toBeInTheDocument();
  });

  test('displays correct counts for each status', () => {
    render(
      <AgentCardGrid 
        agentMetricsTilesData={mockAgentMetricsTilesData} 
        onSelectStatus={mockOnSelectStatus} 
      />
    );

    jest.advanceTimersByTime(1000);

    // All count should be sum of all (5 + 3 + 2 = 10)
    const allCard = screen.getByText('All Servers').closest('.card-container');
    expect(allCard).toHaveTextContent('10');
    
    // Other counts
    expect(screen.getByText('Active Servers').closest('.card-container')).toHaveTextContent('5');
    expect(screen.getByText('Inactive Servers').closest('.card-container')).toHaveTextContent('3');
    expect(screen.getByText('Failed Servers').closest('.card-container')).toHaveTextContent('2');
  });

  test('calls onSelectStatus with correct action when card is clicked', () => {
    render(
      <AgentCardGrid 
        agentMetricsTilesData={mockAgentMetricsTilesData} 
        onSelectStatus={mockOnSelectStatus} 
      />
    );

    jest.advanceTimersByTime(1000);

    // Click on each card and verify the callback
    fireEvent.click(screen.getByText('Active Servers').closest('.card-container')!);
    expect(mockOnSelectStatus).toHaveBeenCalledWith('Active');

    fireEvent.click(screen.getByText('Inactive Servers').closest('.card-container')!);
    expect(mockOnSelectStatus).toHaveBeenCalledWith('Inactive');

    fireEvent.click(screen.getByText('Failed Servers').closest('.card-container')!);
    expect(mockOnSelectStatus).toHaveBeenCalledWith('Failed');

    fireEvent.click(screen.getByText('All Servers').closest('.card-container')!);
    expect(mockOnSelectStatus).toHaveBeenCalledWith('Recent');
  });

  test('applies correct styles when card is selected', () => {
    render(
      <AgentCardGrid 
        agentMetricsTilesData={mockAgentMetricsTilesData} 
        onSelectStatus={mockOnSelectStatus} 
      />
    );

    jest.advanceTimersByTime(1000);

    const activeCard = screen.getByText('Active Servers').closest('.card-container');
    fireEvent.click(activeCard!);

    // Verify the selected card has the active class
    expect(activeCard).toHaveClass('selected');
    // Verify the text color changes to white
    expect(screen.getByText('Active Servers')).toHaveStyle('color: #fff');
    expect(screen.getByText('5')).toHaveStyle('color: #fff');
  });

  test('handles empty array for agentMetricsTilesData', () => {
    render(
      <AgentCardGrid 
        agentMetricsTilesData={[]} 
        onSelectStatus={mockOnSelectStatus} 
      />
    );

    jest.advanceTimersByTime(1000);

    const allCard = screen.getByText('All Servers').closest('.card-container');
    expect(allCard).toHaveTextContent('0');
  });

  test('renders skeleton loaders during initial loading', () => {
    render(
      <AgentCardGrid 
        agentMetricsTilesData={null} 
        onSelectStatus={mockOnSelectStatus} 
      />
    );
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
    jest.advanceTimersByTime(1000);
    expect(screen.queryAllByTestId('skeleton').length).toBe(0);
  });
});


