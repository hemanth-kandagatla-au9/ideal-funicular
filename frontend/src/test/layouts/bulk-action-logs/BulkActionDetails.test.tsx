import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BulkActionDetails from '../../../layouts/bulk-action-logs/components/BulkActionDetails';

const makeJobDetails = () => ({
  jobId: 'JOB-1',
  type: 'agent_config_sync',
  status: 'Completed',
  user: 'admin@company.com',
  createdAt: '2026-04-20T10:00:00Z',
  servers: [
    { serverId: 's1', serverName: 'server-001', status: 'Success', message: 'OK' },
    { serverId: 's2', serverName: 'server-002', status: 'Success', message: 'OK' },
    { serverId: 's3', serverName: 'server-003', status: 'Failure', message: 'Timeout' },
  ],
  serverSummary: { total: 3, success: 2, failure: 1, pending: 0 },
});

describe('BulkActionDetails component', () => {
  it('shows loading indicator when loading', () => {
    render(<BulkActionDetails jobDetails={null} loading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('prompts to select a job when no details', () => {
    render(<BulkActionDetails jobDetails={null} loading={false} />);
    expect(screen.getByText('Select a job to view details')).toBeInTheDocument();
  });

  it('renders job details and filters servers via search and status card clicks', () => {
    const details = makeJobDetails();
    render(<BulkActionDetails jobDetails={details} loading={false} />);


    // Total servers displayed
    expect(screen.getByText('Total Servers')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();

    // Initially all three servers present
    expect(screen.getByText('server-001')).toBeInTheDocument();
    expect(screen.getByText('server-002')).toBeInTheDocument();
    expect(screen.getByText('server-003')).toBeInTheDocument();

    // Search filter - narrow to one server
    const input = screen.getByPlaceholderText('Search servers...');
    fireEvent.change(input, { target: { value: 'server-002' } });
    // At least the searched-for server should be visible or no results message shown
    expect(screen.queryByText('server-001')).not.toBeInTheDocument();

    // Reset search before clicking status card
    fireEvent.change(input, { target: { value: '' } });

    // Click 'Failure' card to filter failed servers (first matching 'Failure' is the summary card)
    fireEvent.click(screen.getAllByText('Failure')[0]);
    expect(screen.getByText('server-003')).toBeInTheDocument();
  });
});
