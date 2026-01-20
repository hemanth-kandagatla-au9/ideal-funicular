import { render, screen, fireEvent } from '@testing-library/react';
import SchedulerDialog from '../../../../layouts/agent-management/components/SchedulerDialog';
import '@testing-library/jest-dom/extend-expect';

// Mock the useDispatch hook
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

describe('SchedulerDialog', () => {
  const mockDispatch = jest.fn();
  const defaultProps = {
    hostname: 'test-host',
    agentId: '123',
    commandJob: '456',
    scheduledData: {},
    resetSchedule: false,
    openEditScheduleCommand: false,
    openScheduleView: true,
    schedulerCommand: true,
    onHide: jest.fn(),
    closeDialog: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the useDispatch implementation
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('react-redux').useDispatch.mockImplementation(() => mockDispatch);
  });

  test('renders without crashing', () => {
    render(<SchedulerDialog {...defaultProps} />);
    expect(screen.getByTestId('schedulerId')).toBeInTheDocument();
  });

  test('displays schedule job title when not in edit mode', () => {
    render(<SchedulerDialog {...defaultProps} />);
    expect(screen.getByText('Schedule Job')).toBeInTheDocument();
  });

  test('displays edit jobs title when in edit mode', () => {
    render(<SchedulerDialog {...defaultProps} openEditScheduleCommand={true} />);
    expect(screen.getByText('Edit Jobs')).toBeInTheDocument();
  });

  test('shows command input when not in edit mode', () => {
    render(<SchedulerDialog {...defaultProps} />);
    expect(screen.getByTestId('scheduleCommandInput')).toBeInTheDocument();
  });

  test('shows source directory input when in edit mode', () => {
    render(<SchedulerDialog {...defaultProps} openEditScheduleCommand={true} />);
    expect(screen.getByTestId('sourceDirTestid')).toBeInTheDocument();
  });

  test('updates command state when input changes', () => {
    render(<SchedulerDialog {...defaultProps} />);
    const input = screen.getByTestId('scheduleCommandInput');
    fireEvent.change(input, { target: { value: 'test command' } });
    expect(input.value).toBe('test command');
  });

  test('updates source directory state when input changes', () => {
    render(<SchedulerDialog {...defaultProps} openEditScheduleCommand={true} />);
    const input = screen.getByTestId('sourceDirTestid');
    fireEvent.change(input, { target: { value: '/test/dir' } });
    expect(input.value).toBe('/test/dir');
  });

  test('disables schedule button when command is empty', () => {
    render(<SchedulerDialog {...defaultProps} />);
    expect(screen.getByText('Schedule')).toBeDisabled();
  });

  test('enables schedule button when command is entered', () => {
    render(<SchedulerDialog {...defaultProps} />);
    const input = screen.getByTestId('scheduleCommandInput');
    fireEvent.change(input, { target: { value: 'test command' } });
    expect(screen.getByText('Schedule')).not.toBeDisabled();
  });

  test('calls closeDialog when cancel button is clicked', () => {
    render(<SchedulerDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.closeDialog).toHaveBeenCalled();
  });

  test('calls onHide when schedule button is clicked', () => {
    render(<SchedulerDialog {...defaultProps} />);
    const input = screen.getByTestId('scheduleCommandInput');
    fireEvent.change(input, { target: { value: 'test command' } });
    fireEvent.click(screen.getByText('Schedule'));
    expect(defaultProps.onHide).toHaveBeenCalledWith(true);
  });

  test('calls onHide when update button is clicked', () => {
    render(<SchedulerDialog {...defaultProps} openEditScheduleCommand={true} />);
    fireEvent.click(screen.getByText('Update'));
    expect(defaultProps.onHide).toHaveBeenCalledWith(true);
  });

  test('initializes with scheduled data', () => {
    const scheduledData = {
      cron_expression: '0 * * * * *',
      script_content: 'existing command',
      opensearch_enabled: false,
      opensearch_index: 'test-index'
    };
    
    render(<SchedulerDialog {...defaultProps} scheduledData={scheduledData} />);
    expect(screen.getByTestId('scheduleCommandInput').value).toBe('existing command');
  });

  test('resets form when resetSchedule changes to true', () => {
    const { rerender } = render(<SchedulerDialog {...defaultProps} />);
    const input = screen.getByTestId('scheduleCommandInput');
    fireEvent.change(input, { target: { value: 'test command' } });
    
    rerender(<SchedulerDialog {...defaultProps} resetSchedule={true} />);
    expect(input.value).toBe('');
  });

  test('does not render schedule button when not in schedule view', () => {
    render(<SchedulerDialog {...defaultProps} openScheduleView={false} />);
    expect(screen.queryByText('Schedule')).not.toBeInTheDocument();
  });

  test('does not render update button when not in edit mode', () => {
    render(<SchedulerDialog {...defaultProps} />);
    expect(screen.queryByText('Update')).not.toBeInTheDocument();
  });

  // Test that dispatch is called when saving/updating
  test('dispatches save action when schedule button is clicked', () => {
    render(<SchedulerDialog {...defaultProps} />);
    const input = screen.getByTestId('scheduleCommandInput');
    fireEvent.change(input, { target: { value: 'test command' } });
    fireEvent.click(screen.getByText('Schedule'));
    
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('dispatches update action when update button is clicked', () => {
    render(<SchedulerDialog {...defaultProps} openEditScheduleCommand={true} />);
    fireEvent.click(screen.getByText('Update'));
    
    expect(mockDispatch).toHaveBeenCalled();
  });
});


