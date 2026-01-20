import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MultiSelectDropdown from '../../../../layouts/agent-management/components/MultiSelectDropdown';
import '@testing-library/jest-dom';

describe('MultiSelectDropdown', () => {
  const mockDataOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'selectAll', label: 'Select All' },
  ];

  const defaultProps = {
    dataOptions: mockDataOptions,
    dropDownName: 'Test Dropdown',
    id: 'test-dropdown',
    onSelectChange: jest.fn(),
    value: [],
    selectAllOption: jest.fn(),
    open: false,
    onApplyClick: jest.fn(),
    toggleOpen: jest.fn(),
    clearAll: jest.fn(),
    toggleTestId: 'toggle-button',
    selectTestId: 'select-all',
    clearTestId: 'clear-all',
    applyTestId: 'apply-button',
    applyDisabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<MultiSelectDropdown {...defaultProps} />);
    expect(screen.getByTestId('multiselectDropdown')).toBeInTheDocument();
  });

  test('displays the dropdown name', () => {
    render(<MultiSelectDropdown {...defaultProps} />);
    expect(screen.getByText('Test Dropdown')).toBeInTheDocument();
  });

  test('shows down arrow icon', () => {
    render(<MultiSelectDropdown {...defaultProps} />);
    expect(screen.getByRole('img', { name: 'down arrow' })).toBeInTheDocument();
  });

  test('calls toggleOpen when button is clicked', () => {
    render(<MultiSelectDropdown {...defaultProps} />);
    const toggleButton = screen.getByTestId('toggle-button');
    fireEvent.click(toggleButton);
    expect(defaultProps.toggleOpen).toHaveBeenCalled();
  });

  test('renders Select component when open is true', () => {
    const { container } = render(<MultiSelectDropdown {...defaultProps} open={true} />);
    // Verify the dropdown menu appears
    expect(container.querySelector('.risebot-dropdownMenu')).toBeInTheDocument();
  });

  test('does not render Select when open is false', () => {
    const { container } = render(<MultiSelectDropdown {...defaultProps} open={false} />);
    expect(container.querySelector('.risebot-dropdownMenu')).not.toBeInTheDocument();
  });

  test('renders Blanket when open is true', () => {
    const { container } = render(<MultiSelectDropdown {...defaultProps} open={true} />);
    const blanket = container.querySelector('div[style*="position: fixed"]');
    expect(blanket).toBeInTheDocument();
  });

  test('calls toggleOpen when Blanket is clicked', () => {
    const { container } = render(<MultiSelectDropdown {...defaultProps} open={true} />);
    const blanket = container.querySelector('div[style*="position: fixed"]');
    fireEvent.click(blanket);
    expect(defaultProps.toggleOpen).toHaveBeenCalled();
  });

  test('applies correct test IDs to buttons', () => {
    render(<MultiSelectDropdown {...defaultProps} />);
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  // Testing the sub-components through integration
  test('dropdown menu has correct styles when open', () => {
    const { container } = render(<MultiSelectDropdown {...defaultProps} open={true} />);
    const menu = container.querySelector('.risebot-dropdownMenu');
    
    expect(menu).toHaveStyle('background-color: white');
    expect(menu).toHaveStyle('border-radius: 8px');
    expect(menu).toHaveStyle('margin-top: 8px');
  });

  test('blanket has correct styles when open', () => {
    const { container } = render(<MultiSelectDropdown {...defaultProps} open={true} />);
    const blanket = container.querySelector('div[style*="position: fixed"]');
    
    expect(blanket).toHaveStyle('position: fixed');
    expect(blanket).toHaveStyle('z-index: 1');
  });

  test('dropdown wrapper has correct structure', () => {
    const { container } = render(<MultiSelectDropdown {...defaultProps} />);
    
    // Get all divs and find the one with position: relative
    const divs = container.querySelectorAll('div');
    const wrapper = Array.from(divs).find(div => 
      window.getComputedStyle(div).position === 'relative'
    );
    
    expect(wrapper).toBeTruthy();
  });
});


