import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CronTab from '../../../layouts/agent-management/components/CronTab';

describe('CronTab Component', () => {
  const mockOnChange = jest.fn();
  const mockOnClear = jest.fn();
  const defaultProps = {
    value: '0 0 * * *',
    onChange: mockOnChange,
    onClear: mockOnClear,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('calls onChange when cron expression is modified', () => {
    render(<CronTab {...defaultProps} />);
  });

  test('calls onClear when Clear All button is clicked', () => {
    render(<CronTab {...defaultProps} />);
    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });


  test('matches snapshot with default props', () => {
    const { asFragment } = render(<CronTab {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('matches snapshot with different cron value', () => {
    const { asFragment } = render(
      <CronTab {...defaultProps} value="*/5 * * * *" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});


