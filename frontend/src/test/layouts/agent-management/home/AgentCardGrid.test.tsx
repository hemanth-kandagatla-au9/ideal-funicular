import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentCardGrid, { AgentMetricsTile } from '../../../../layouts/agent-management/home/AgentCardGrid';
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
    jest.advanceTimersByTime(1000);
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
    const allCard = screen.getByText('All Servers').closest('.card-container');
    expect(allCard).toHaveTextContent('10');
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
    const Wrapper = () => {
      const [currentStatus, setCurrentStatus] = React.useState('Recent');
      return (
        <AgentCardGrid
          agentMetricsTilesData={mockAgentMetricsTilesData}
          onSelectStatus={setCurrentStatus}
          currentStatus={currentStatus}
        />
      );
    };

    render(<Wrapper />);

    jest.advanceTimersByTime(1000);

    const activeCard = screen.getByText('Active Servers').closest('.card-container');
    fireEvent.click(activeCard!);
    expect(activeCard).toHaveClass('selected');
    expect(activeCard).toHaveStyle('border: 1px solid #2961F4');
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


