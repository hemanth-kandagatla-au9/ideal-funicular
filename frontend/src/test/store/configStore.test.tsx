import { configureStore } from "@reduxjs/toolkit";
import store from './../../store/configStore';
const mockReducer = (state = {}) => state;

describe('Redux Store Configuration', () => {
  let store;
  
  beforeEach(() => {
    store = configureStore({
      reducer: {
        mock: mockReducer
      }
    });
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  it('should have a getState method', () => {
    expect(typeof store.getState).toBe('function');
  });

  it('should return the initial state', () => {
    const state = store.getState();
    expect(state).toEqual({ mock: {} });
  });

  it('should have a dispatch method', () => {
    expect(typeof store.dispatch).toBe('function');
  });

  it('should have a subscribe method', () => {
    expect(typeof store.subscribe).toBe('function');
  });
});


