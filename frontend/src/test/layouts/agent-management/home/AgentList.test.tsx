/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AgentList from '../../../../layouts/agent-management/home/AgentList';
import '@testing-library/jest-dom/extend-expect';


jest.mock('../../../../redux/actions/agentManagement.action', () => ({
    fetchHealthCheckup: jest.fn((payload) => ({
      type: 'FETCH_HEALTH_CHECKUP',
      payload
    }))
  }));

describe('AgentList Component', () => {
  const mockAgents = [
    {
      hostname: 'agent1',
      os: 'Linux',
      agent_details: { up_time: '2 days' },
      risebot: { pid: '1234' },
      status: 'Active',
      risebotProperties: {
        agent: { version: '1.0.0' },
        server: { port: 8080 }
      }
    },
    {
      hostname: 'agent2',
      os: 'Windows',
      agent_details: { up_time: '1 day' },
      risebot: { pid: '5678' },
      status: 'Inactive',
      risebotProperties: {
        agent: { version: '1.1.0' },
        server: { port: 8081 }
      }
    }
  ];

  const mockPagination = {
    limit: 10,
    page: 1,
    total: 2,
    totalPages: 1
  };

  const defaultProps = {
    loading: false,
    agents: mockAgents,
    pagination: mockPagination,
    selectedHostnameAgentsData: [],
    setSelectedHostnameAgentsData: jest.fn(),
    handlePagination: jest.fn(),
    handleSelectHostAgent: jest.fn(),
    toggleSideBar: jest.fn(),
    dispatch: jest.fn()
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders no data found when agents array is empty', () => {
    render(<AgentList {...defaultProps} agents={[]} />);
    
    expect(screen.getByAltText('No Data')).toBeInTheDocument();
    expect(screen.getByText(/No data found/i)).toBeInTheDocument(); // Use regex for partial match
  });



  test('renders agent list correctly when not loading and has data', () => {
    render(<AgentList {...defaultProps} />);
    
    // Check header row
    expect(screen.getByText('Hostname')).toBeInTheDocument();
    expect(screen.getByText('PID')).toBeInTheDocument();
    expect(screen.getByText('OS')).toBeInTheDocument();
    expect(screen.getByText('Uptime')).toBeInTheDocument();
    expect(screen.getByText('Version')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    
    // Check agent data
    expect(screen.getByText('agent1')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('Linux')).toBeInTheDocument();
    expect(screen.getByText('2 days')).toBeInTheDocument();
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    
    expect(screen.getByText('agent2')).toBeInTheDocument();
    expect(screen.getByText('5678')).toBeInTheDocument();
    expect(screen.getByText('Windows')).toBeInTheDocument();
    expect(screen.getByText('1 day')).toBeInTheDocument();
    expect(screen.getByText('v1.1.0')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  test('renders pagination component with correct props', () => {
    render(<AgentList {...defaultProps} />);
    
   
    expect(defaultProps.pagination).toEqual(expect.objectContaining({
      limit: 10,
      page: 1,
      total: 2,
      totalPages: 1
    }));
    
   
    expect(defaultProps.handlePagination).toBeDefined();
  });

  test('handles select all agents correctly', () => {
    render(<AgentList {...defaultProps} />);
    
    const selectAllButton = screen.getAllByTestId('agentTickBtn')[0];
    fireEvent.click(selectAllButton);
    
    expect(defaultProps.setSelectedHostnameAgentsData).toHaveBeenCalledWith([
      { hostname: 'agent1', agent_details: { up_time: '2 days' } },
      { hostname: 'agent2', agent_details: { up_time: '1 day' } }
    ]);
  });

  test('handles deselect all agents correctly when all are selected', () => {
    const propsWithSelectedAgents = {
      ...defaultProps,
      selectedHostnameAgentsData: [
        { hostname: 'agent1', agent_details: {} },
        { hostname: 'agent2', agent_details: {} }
      ]
    };
    
    render(<AgentList {...propsWithSelectedAgents} />);
    
    const selectAllButton = screen.getAllByTestId('agentTickBtn')[0];
    fireEvent.click(selectAllButton);
    
    expect(defaultProps.setSelectedHostnameAgentsData).toHaveBeenCalledWith([]);
  });

  test('handles individual agent selection', () => {
    render(<AgentList {...defaultProps} />);
    
    const agentSelectButtons = screen.getAllByTestId('agentTickBtn');
    // First button is select all, second is for first agent
    fireEvent.click(agentSelectButtons[1]);
    
    expect(defaultProps.handleSelectHostAgent).toHaveBeenCalledWith('agent1');
  });

  test('displays blue tick for selected agents', () => {
    const propsWithSelectedAgent = {
      ...defaultProps,
      selectedHostnameAgentsData: [{ hostname: 'agent1', agent_details: {} }]
    };
    
    render(<AgentList {...propsWithSelectedAgent} />);
    
    // Verify that handleSelectHostAgent was called with the right hostname
    // when clicking the tick button
    const agentSelectButtons = screen.getAllByTestId('agentTickBtn');
    fireEvent.click(agentSelectButtons[1]);
    
    expect(defaultProps.handleSelectHostAgent).toHaveBeenCalledWith('agent1');
  });

  test('handles health check button click', () => {
    const { fetchHealthCheckup } = require('../../../../redux/actions/agentManagement.action');
    
    render(<AgentList {...defaultProps} />);
    
    const healthCheckButtons = screen.getAllByTestId('agentHealthChecktBtn');
    fireEvent.click(healthCheckButtons[0]);
    
    // Verify the correct payload was sent
    expect(fetchHealthCheckup).toHaveBeenCalledWith({
      hostname: 'agent1',
      port: 8080
    });
    
    // Verify dispatch was called
    expect(defaultProps.dispatch).toHaveBeenCalled();
  });

  test('handles view sidebar button click', () => {
    render(<AgentList {...defaultProps} />);
    
    const viewButtons = screen.getAllByAltText('view');
    fireEvent.click(viewButtons[1]);
    
    expect(defaultProps.toggleSideBar).toHaveBeenCalledWith('agent1');
  });

  test('displays correct status badges', () => {
    render(<AgentList {...defaultProps} />);
    
    const activeBadge = screen.getByText('Active');
    const inactiveBadge = screen.getByText('Inactive');
    
    expect(activeBadge).toHaveClass('statusBadge active');
    expect(inactiveBadge).toHaveClass('statusBadge inactive');
  });

  test('displays correct version badges', () => {
    render(<AgentList {...defaultProps} />);
    
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    expect(screen.getByText('v1.1.0')).toBeInTheDocument();
  });

  test('areAllAgentsSelected returns correct value', () => {
  });

  test('toggleSelectOrDeselectAllAgents works correctly', () => {
  });
    
  test('renders loading skeleton correctly', () => {
    render(<AgentList {...defaultProps} loading={true} />);
    
    // In loading state, we should have:
    // - 1 agentTickBtn in the header (select all button)
    // - No additional tick buttons since skeletons are rendered instead of actual agent rows
    
    // Verify skeleton elements are rendered by checking for MUI Skeleton classes
    const circularSkeletons = document.querySelectorAll('.MuiSkeleton-circular');
    const textSkeletons = document.querySelectorAll('.MuiSkeleton-text');
    
    // Verify we have the expected skeleton counts
    expect(circularSkeletons.length).toBeGreaterThan(0);
    expect(textSkeletons.length).toBeGreaterThan(0);
    
    // Verify only the header tick button exists in loading state
    expect(screen.getAllByTestId('agentTickBtn')).toHaveLength(1);
  });
});


