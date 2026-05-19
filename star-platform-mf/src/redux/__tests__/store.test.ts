import { store, persistor } from '../store';

describe('Redux Store Configuration', () => {
  test('should initialize store correctly', () => {
    const state = store.getState();

    expect(state).toBeDefined();
    expect(state.permissions).toBeDefined();
  });

  test('should have dispatch function', () => {
    expect(typeof store.dispatch).toBe('function');
  });

  test('should initialize persistor', () => {
    expect(persistor).toBeDefined();
    expect(typeof persistor.persist).toBe('function');
  });

  test('should allow dispatching a normal action', () => {
    const result = store.dispatch({ type: 'TEST_ACTION' });
    expect(result).toBeDefined();
  });

  test('should attach store to window object', () => {
    expect((window as any).__REDUX_STORE__).toBe(store);
  });
});
