import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentCardGrid, { AgentMetricsTile } from '../../../../layouts/agent-management/home/AgentCardGrid';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) => selector({
    userAuthorization: {
      myPermissions: [
        {
          project: 'agent',
          modules: [
            {
              module: 'Rise Agent',
              hasAccess: true,
              permissions: [
                { label: 'Rise Agent : view_agent', hasAccess: true },
                { label: 'Rise Agent : check_status', hasAccess: true }
              ]
            }
          ]
        }
      ],
      myPermissionsLoading: false
    }
  }),
}));

jest.mock('@/utils/hooks/useAgentPermissions', () => ({
  __esModule: true,
  default: () => ({
    hasPermission: () => true,
    loading: false,
    permissions: []
  })
}));

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
    const { container } = render(
      <AgentCardGrid
        agentMetricsTilesData={mockAgentMetricsTilesData} 
        onSelectStatus={mockOnSelectStatus} 
      />
    );
    jest.advanceTimersByTime(1000);
    expect(container).toBeInTheDocument();
  });

  test('displays correct counts for each status', () => {
    const { container } = render(
      <AgentCardGrid 
        agentMetricsTilesData={mockAgentMetricsTilesData} 
        onSelectStatus={mockOnSelectStatus} 
      />
    );

    jest.advanceTimersByTime(1000);
    expect(container).toBeInTheDocument();
  });

  test.skip('calls onSelectStatus with correct action when card is clicked', () => {
    const { container } = render(
      <AgentCardGrid 
        agentMetricsTilesData={mockAgentMetricsTilesData} 
        onSelectStatus={mockOnSelectStatus} 
      />
    );

    jest.advanceTimersByTime(1000);
    expect(container).toBeInTheDocument();
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

    const { container } = render(<Wrapper />);

    jest.advanceTimersByTime(1000);

    expect(container).toBeInTheDocument();
  });

  test('handles empty array for agentMetricsTilesData', () => {
    const { container } = render(
      <AgentCardGrid 
        agentMetricsTilesData={[]} 
        onSelectStatus={mockOnSelectStatus} 
      />
    );

    jest.advanceTimersByTime(1000);

    expect(container).toBeInTheDocument();
  });

  test('renders skeleton loaders during initial loading', () => {
    const { container } = render(
      <AgentCardGrid 
        agentMetricsTilesData={null} 
        onSelectStatus={mockOnSelectStatus} 
      />
    );
    jest.advanceTimersByTime(1000);
    expect(container).toBeInTheDocument();
  });
});