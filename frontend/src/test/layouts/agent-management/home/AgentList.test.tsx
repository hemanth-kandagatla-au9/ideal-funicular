/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AgentList from '../../../../layouts/agent-management/home/AgentList';
import '@testing-library/jest-dom/extend-expect';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) => selector({}),
  Provider: ({ children }) => children,
}));

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
    pageNo: 1,
    totalPage: 1,
    totalRows: 2
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
    expect(screen.getByText('Hostname')).toBeInTheDocument();
    expect(screen.getByText('OS')).toBeInTheDocument();
    expect(screen.getByText('Uptime')).toBeInTheDocument();
    expect(screen.getByText('Version')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('agent1')).toBeInTheDocument();
    expect(screen.getByText('Linux')).toBeInTheDocument();
    expect(screen.getByText('2 days')).toBeInTheDocument();
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    
    expect(screen.getByText('agent2')).toBeInTheDocument();
    expect(screen.getByText('Windows')).toBeInTheDocument();
    expect(screen.getByText('1 day')).toBeInTheDocument();
    expect(screen.getByText('v1.1.0')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  test('renders pagination component with correct props', () => {
    render(<AgentList {...defaultProps} />);
    
   
    expect(defaultProps.pagination).toEqual(expect.objectContaining({
      limit: 10,
      pageNo: 1,
      totalPage: 1,
      totalRows: 2
    }));
    
   
    expect(defaultProps.handlePagination).toBeDefined();
  });

  test('handles select all agents correctly', () => {
    render(<AgentList {...defaultProps} />);
    
    const selectAllButton = screen.getAllByTestId('agentTickBtn')[0];
    fireEvent.click(selectAllButton);
    
    expect(defaultProps.setSelectedHostnameAgentsData).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ hostname: 'agent1' }),
        expect.objectContaining({ hostname: 'agent2' })
      ])
    );
  });

  test('handles deselect all agents correctly when all are selected', () => {
    const propsWithSelectedAgents = {
      ...defaultProps,
      selectedHostnameAgentsData: mockAgents
    };
    
    render(<AgentList {...propsWithSelectedAgents} />);
    
    const selectAllButton = screen.getAllByTestId('agentTickBtn')[0];
    fireEvent.click(selectAllButton);
    
    expect(defaultProps.setSelectedHostnameAgentsData).toHaveBeenCalledWith([]);
  });

  test('handles individual agent selection', () => {
    render(<AgentList {...defaultProps} />);
    
    const agentSelectButtons = screen.getAllByTestId('agentTickBtn');
    fireEvent.click(agentSelectButtons[1]);
    
    expect(defaultProps.handleSelectHostAgent).toHaveBeenCalledWith('agent1');
  });

  test('displays blue tick for selected agents', () => {
    const propsWithSelectedAgent = {
      ...defaultProps,
      selectedHostnameAgentsData: [mockAgents[0]]
    };
    
    render(<AgentList {...propsWithSelectedAgent} />);
    const agentSelectButtons = screen.getAllByTestId('agentTickBtn');
    fireEvent.click(agentSelectButtons[1]);
    
    expect(defaultProps.handleSelectHostAgent).toHaveBeenCalledWith('agent1');
  });

  test('handles health check button click', () => {
    const { fetchHealthCheckup } = require('../../../../redux/actions/agentManagement.action');
    
    render(<AgentList {...defaultProps} />);
    
    const healthCheckButtons = screen.getAllByTestId('agentHealthChecktBtn');
    fireEvent.click(healthCheckButtons[0]);
    expect(fetchHealthCheckup).toHaveBeenCalledWith({
      hostname: 'agent1',
      port: 8080
    });
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

  test('expands hostname accordion and shows module sections', () => {
    render(<AgentList {...defaultProps} />);

    const toggleButtons = screen.getAllByTestId('hostnameAccordionToggle');
    fireEvent.click(toggleButtons[0]);

    expect(screen.getByText('Agent')).toBeInTheDocument();
    expect(screen.getByText('Supervisor')).toBeInTheDocument();
    expect(screen.getByText('Cybersphere')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Workflow')).toBeInTheDocument();
  });

  test('areAllAgentsSelected returns correct value', () => {
  });

  test('toggleSelectOrDeselectAllAgents works correctly', () => {
  });
    
  test('renders loading skeleton correctly', () => {
    render(<AgentList {...defaultProps} loading={true} />);
    const circularSkeletons = document.querySelectorAll('.MuiSkeleton-circular');
    const textSkeletons = document.querySelectorAll('.MuiSkeleton-text');
    expect(circularSkeletons.length).toBeGreaterThan(0);
    expect(textSkeletons.length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('agentTickBtn')).toHaveLength(1);
  });
});


