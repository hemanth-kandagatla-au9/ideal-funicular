import store from './../../store/configStore';

describe('Redux Store Configuration', () => {
  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  it('should have a getState method', () => {
    expect(typeof store.getState).toBe('function');
  });

  it('should return the initial state', () => {
    const state = store.getState();
    expect(state).toBeDefined();
  });

  it('should have a dispatch method', () => {
    expect(typeof store.dispatch).toBe('function');
  });

  it('should have a subscribe method', () => {
    expect(typeof store.subscribe).toBe('function');
  });
});


