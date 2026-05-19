import React from 'react';
import { render, screen } from '@testing-library/react';
import AccessDeniedPage from '../AccessDenied';

// mock css module
jest.mock('../../AccessDenied.module.scss', () => ({
  access_denied_container: 'access_denied_container',
  access_denied_card: 'access_denied_card',
  access_denied_title: 'access_denied_title',
  access_denied_message: 'access_denied_message',
  icon_wrapper_image: 'icon_wrapper_image',
}));

// mock image import
jest.mock('../../../assets/Unauthorized.svg', () => 'unauthorized.svg');

describe('AccessDeniedPage', () => {
  it('renders access denied content correctly', () => {
    render(<AccessDeniedPage />);

    // check title
    expect(screen.getByText('Access Denied')).toBeInTheDocument();

    // check message
    expect(
      screen.getByText('Sorry, but you don’t have permission to access this page.')
    ).toBeInTheDocument();

    // check image
    const image = screen.getByAltText('Unauthorized Access');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'unauthorized.svg');
  });
});
