import { render, fireEvent,screen } from '@testing-library/react';
import Paginate from '../components/ui/paginate/paginate';

describe('Paginate component', () => {
  const mockProps = {
    currentPage: 1,
    setCurrentPage: jest.fn(),
    itemsPerPage: 10,
    setItemsPerPage: jest.fn(),
    totalPages: 5,
    pageInput: '',
    setPageInput: jest.fn(),
    ModalStyling: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates pageInput on valid input change', () => {
    const { getByPlaceholderText } = render(<Paginate {...mockProps} />);

    const input = getByPlaceholderText('Enter');
    fireEvent.change(input, { target: { value: '3' } });

    expect(mockProps.setPageInput).toHaveBeenCalledWith('3');
  });

  it('does not update pageInput on invalid input change', () => {
    const { getByPlaceholderText } = render(<Paginate {...mockProps} />);

    const input = getByPlaceholderText('Enter');
    fireEvent.change(input, { target: { value: 'abc' } });

    expect(mockProps.setPageInput).not.toHaveBeenCalled();
  });

  it('calls setCurrentPage and updates pageInput on valid "Go" button click', () => {
    const { getByRole } = render(
      <Paginate {...mockProps} pageInput="3" totalPages={5} />
    );

    const goButton = getByRole('button', { name: 'Go' });
    fireEvent.click(goButton);

    expect(mockProps.setCurrentPage).toHaveBeenCalledWith(3);
    expect(mockProps.setPageInput).toHaveBeenCalledWith(3);
  });

  it('does not call setCurrentPage on invalid "Go" button click (less than 1)', () => {
    const { getByRole } = render(
      <Paginate {...mockProps} pageInput="0" totalPages={5} />
    );

    const goButton = getByRole('button', { name: 'Go' });
    fireEvent.click(goButton);

    expect(mockProps.setCurrentPage).not.toHaveBeenCalled();
  });

  it('handles page change via pagination buttons', () => {
    const { getByRole } = render(<Paginate {...mockProps} />);

    const nextPageButton = getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    expect(mockProps.setCurrentPage).toHaveBeenCalledWith(2);
  });

 

  it('disables "Go" button when pageInput is out of range', () => {
    const { getByRole } = render(
      <Paginate {...mockProps} pageInput="6" totalPages={5} />
    );

    const goButton = getByRole('button', { name: 'Go' });
    expect(goButton).toBeDisabled();
  });

  it('handles changes in ModalStyling prop', () => {
    const { container } = render(
      <Paginate {...mockProps} ModalStyling={true} />
    );

    expect(container.querySelector('.pagination-container-modal')).toBeInTheDocument();
  });

  it('updates items per page correctly', () => {
    render(<Paginate {...mockProps} />);

    // Open the dropdown
    const select = screen.getByText('10');
    fireEvent.mouseDown(select);

    // Select the 20 items per page option
    const option = screen.getByRole('option', { name: '20' });
    fireEvent.click(option);

    expect(mockProps.setItemsPerPage).toHaveBeenCalledWith('20');
    expect(mockProps.setCurrentPage).toHaveBeenCalledWith(1);
  });

  it('clears pageInput on page change', () => {
    render(<Paginate {...mockProps} />);
    fireEvent.change(screen.getByPlaceholderText('Enter'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(mockProps.setPageInput).toHaveBeenCalledWith('');
  });

  it('enables Go button with valid input', () => {
    render(<Paginate {...mockProps} pageInput="3" totalPages={5} />);
    const goButton = screen.getByRole('button', { name: 'Go' });
    expect(goButton).not.toBeDisabled();
  });
  it('disables Go button with invalid input', () => {
    render(<Paginate {...mockProps} pageInput="6" totalPages={5} />);
    const goButton = screen.getByRole('button', { name: 'Go' });
    expect(goButton).toBeDisabled();
  });
  it('resets input value after clicking Go', () => {
    const { getByRole, getByPlaceholderText } = render(
      <Paginate {...mockProps} pageInput="3" totalPages={5} />
    );
    const goButton = getByRole('button', { name: 'Go' });
    fireEvent.click(goButton);
    expect(getByPlaceholderText('Enter').value).toBe('3');
  });
});
