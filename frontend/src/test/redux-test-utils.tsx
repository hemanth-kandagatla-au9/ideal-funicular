import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Store, createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../redux/reducers';
import INITIAL_STATE from '../redux/initialState';

/**
 * Creates a Redux store for testing with all reducers properly initialized
 */
export function createTestStore(initialState = {}): Store {
  // Provide sensible defaults for all reducer slices
  const preloadedState = {
    app: initialState.app || INITIAL_STATE.app || { appReady: false },
    agentMangement: initialState.agentMangement || {},
    userAuthorization: {
      users: [],
      loading: false,
      error: null,
      pagination: { page: 1, limit: 10, total: 0 },
      selectedUsers: [],
      permissions: [],
      globalPermissions: null,
      permissionsPagination: { page: 1, limit: 10, total: 0 },
      myPermissions: null,
      myPermissionsLoading: false,
      ...initialState.userAuthorization,
    },
  };

  const store = createStore(
    rootReducer,
    preloadedState,
    compose(applyMiddleware())
  );
  return store;
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: any;
  store?: Store;
}

/**
 * Custom render function that wraps components with Redux Provider
 * Usage: const { getByText } = renderWithRedux(<MyComponent />);
 */
export function renderWithRedux(
  ui: ReactElement,
  {
    initialState = {},
    store = createTestStore(initialState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }), store };
}

/**
 * Export everything from React Testing Library
 */
export * from '@testing-library/react';

/**
 * Export render for backwards compatibility, but users should prefer renderWithRedux
 */
export { render };