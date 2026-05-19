// src/pages/remotes/__tests__/InsAuth.test.js

import path from 'path';

describe('InsightsAuthApp lazy loader', () => {
  const moduleDir = path.join(__dirname, '..'); // src/pages/remotes
  const insAuthPath = require.resolve(path.join(moduleDir, 'InsAuth'));
  const safeLazyPath = require.resolve(path.join(moduleDir, '..', '..', 'utils', 'safeLazy'));

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('calls safeLazy with a dynamic import factory and exports its return value', () => {
    let exported;
    let safeLazy;

    jest.isolateModules(() => {
      // Mock the remote module so the factory can be invoked safely
      jest.doMock('InsightsAuth/authApp', () => ({ __esModule: true, default: 'RemoteAuthApp' }), {
        virtual: true,
      });

      // Mock safeLazy and invoke the factory to exercise the inline function
      jest.doMock(safeLazyPath, () => ({
        __esModule: true,
        default: jest.fn((factory) => {
          const maybePromise = factory();
          // Swallow a potential rejection to avoid unhandled promise noise
          if (maybePromise && typeof maybePromise.then === 'function') {
            maybePromise.catch(() => {});
          }
          return 'MockInsightsAuthLazy';
        }),
      }));

      exported = require(insAuthPath);
      safeLazy = require(safeLazyPath).default;
    });

    // safeLazy called exactly once with a function factory
    expect(safeLazy).toHaveBeenCalledTimes(1);
    const [factory] = safeLazy.mock.calls[0];
    expect(typeof factory).toBe('function');

    // Export equals what safeLazy returned
    expect(exported.InsightsAuthApp).toBe('MockInsightsAuthLazy');
  });

  it('exposes a factory that returns a thenable (promise-like) when invoked', () => {
    let safeLazy;
    let factory;

    jest.isolateModules(() => {
      // Ensure the dynamic import target exists virtually
      jest.doMock('InsightsAuth/authApp', () => ({ __esModule: true, default: 'RemoteAuthApp' }), {
        virtual: true,
      });

      // Mock safeLazy but do not execute the factory here; we will inspect it
      jest.doMock(safeLazyPath, () => ({
        __esModule: true,
        default: jest.fn((f) => 'MockInsightsAuthLazy'),
      }));

      require(insAuthPath);
      safeLazy = require(safeLazyPath).default;
      factory = safeLazy.mock.calls[0][0];
    });

    expect(factory).toEqual(expect.any(Function));
    const result = factory();
    expect(result && typeof result.then).toBe('function');
  });
});
