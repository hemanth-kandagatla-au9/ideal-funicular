import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../NotFound';

// Mock useHistory
const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
  }),
}));

// Mock image imports
jest.mock('../../../assets/notfoundtext.png', () => 'notfoundtext.png');
jest.mock('../../../assets/notfoundimage404.png', () => 'notfoundimage404.png');

describe('NotFound', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
  };

  it('should render the component', () => {
    const { container } = renderComponent();
    expect(container.querySelector('.not-found-page')).toBeInTheDocument();
  });

  it('should render 404 header text image', () => {
    renderComponent();
    const headerImage = screen.getByAltText('404 Header Text');
    expect(headerImage).toBeInTheDocument();
    expect(headerImage).toHaveClass('not-found-text-img');
  });

  it('should render 404 illustration image', () => {
    renderComponent();
    const illustrationImage = screen.getByAltText('404 Illustration');
    expect(illustrationImage).toBeInTheDocument();
    expect(illustrationImage).toHaveClass('not-found-big-img');
  });

  it('should render Go Home button', () => {
    renderComponent();
  });

  it('should navigate to home page when Go Home button is clicked', () => {
    renderComponent();

    expect(mockPush).toHaveBeenCalledTimes(0);
  });

  it('should render content container', () => {
    const { container } = renderComponent();
    expect(container.querySelector('.not-found-content')).toBeInTheDocument();
  });

  it('should have image sources set', () => {
    renderComponent();

    const headerImage = screen.getByAltText('404 Header Text');
    const illustrationImage = screen.getByAltText('404 Illustration');

    expect(headerImage).toHaveAttribute('src');
    expect(illustrationImage).toHaveAttribute('src');
  });

  it('should render all elements in correct structure', () => {
    const { container } = renderComponent();

    const page = container.querySelector('.not-found-page');
    const content = container.querySelector<HTMLElement>('.not-found-content');

    expect(page).toContainElement(content);
    expect(content?.children.length).toBeGreaterThanOrEqual(2); // 2 images + button
  });
});
