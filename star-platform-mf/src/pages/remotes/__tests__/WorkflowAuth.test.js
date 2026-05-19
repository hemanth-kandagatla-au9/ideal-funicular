// src/pages/remotes/__tests__/WorkflowAuth.test.js

import path from 'path';

describe('workflowAuthApp lazy loader', () => {
  const moduleDir = path.join(__dirname, '..'); // src/pages/remotes
  const workflowAuthPath = require.resolve(path.join(moduleDir, 'WorkflowAuth'));
  const safeLazyPath = require.resolve(path.join(moduleDir, '..', '..', 'utils', 'safeLazy'));

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('calls safeLazy with a dynamic import factory and exports its return value', () => {
    let exported;
    let safeLazy;

    jest.isolateModules(() => {
      // Mock the dynamic remote so the factory can be invoked safely
      jest.doMock('WorkflowAuth/authApp', () => ({ __esModule: true, default: 'RemoteAuthApp' }), {
        virtual: true,
      });

      // Mock safeLazy and invoke the factory to exercise the inline function
      jest.doMock(safeLazyPath, () => ({
        __esModule: true,
        default: jest.fn((factory) => {
          const maybePromise = factory();
          // Swallow the promise rejection if the import fails for any reason
          if (maybePromise && typeof maybePromise.then === 'function') {
            maybePromise.catch(() => {});
          }
          return 'MockWorkflowAuthLazy';
        }),
      }));

      exported = require(workflowAuthPath);
      safeLazy = require(safeLazyPath).default;
    });

    // safeLazy called exactly once with a function factory
    expect(safeLazy).toHaveBeenCalledTimes(1);
    const [factory] = safeLazy.mock.calls[0];
    expect(typeof factory).toBe('function');

    // Export equals what safeLazy returned
    expect(exported.workflowAuthApp).toBe('MockWorkflowAuthLazy');
  });

  it('provides a factory that returns a thenable (promise-like) when invoked', () => {
    let safeLazy;
    let factory;

    jest.isolateModules(() => {
      // Mock the dynamic remote so import() returns a promise
      jest.doMock('WorkflowAuth/authApp', () => ({ __esModule: true, default: 'RemoteAuthApp' }), {
        virtual: true,
      });

      // Mock safeLazy without calling the factory automatically,
      // so we can inspect and manually invoke it here.
      jest.doMock(safeLazyPath, () => ({
        __esModule: true,
        default: jest.fn((f) => {
          // Do not execute the factory here
          return 'MockWorkflowAuthLazy';
        }),
      }));

      require(workflowAuthPath);
      safeLazy = require(safeLazyPath).default;
      factory = safeLazy.mock.calls[0][0];
    });

    // The captured factory should be callable and return a promise-like object
    expect(factory).toEqual(expect.any(Function));
    const result = factory();
    expect(result && typeof result.then).toBe('function');
  });
});
