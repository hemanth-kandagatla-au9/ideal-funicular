import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { createMockStore } from './storeMock';
import { mockMsalInstance } from './msalMock';

interface AllTheProvidersProps {
  children: React.ReactNode;
}

export const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  const store = createMockStore();

  return (
    <Provider store={store}>
      <MsalProvider instance={mockMsalInstance as any}>
        <BrowserRouter>{children}</BrowserRouter>
      </MsalProvider>
    </Provider>
  );
};

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { renderWithProviders as render };
