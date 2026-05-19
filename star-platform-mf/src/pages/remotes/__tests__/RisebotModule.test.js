// src/pages/remotes/__tests__/RisebotModule.test.js

describe('RisebotModule lazy loader', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('calls safeLazy with a dynamic import factory and exports its return value', () => {
    let exported;
    let safeLazy;

    jest.isolateModules(() => {
      // Mock the dynamic remote so the factory can be invoked safely
      jest.doMock('risebot/risebot', () => ({ __esModule: true, default: 'RemoteRisebot' }), {
        virtual: true,
      });

      // Mock safeLazy and invoke the factory to exercise the inline function
      jest.doMock('../../../utils/safeLazy', () => ({
        __esModule: true,
        default: jest.fn((factory) => {
          const maybePromise = factory();
          if (maybePromise && typeof maybePromise.then === 'function') {
            // Avoid unhandled promise rejections in test output
            maybePromise.catch(() => {});
          }
          return 'MockRisebotLazy';
        }),
      }));

      exported = require('../RisebotModule');
      safeLazy = require('../../../utils/safeLazy').default;
    });

    // safeLazy called once with a function factory
    expect(safeLazy).toHaveBeenCalledTimes(1);
    const [factory] = safeLazy.mock.calls[0];
    expect(typeof factory).toBe('function');

    // Export equals what the mocked safeLazy returned
    expect(exported.RisebotModule).toBe('MockRisebotLazy');
  });

  it('exposes a factory that returns a thenable (promise-like) when invoked', () => {
    let safeLazy;
    let factory;

    jest.isolateModules(() => {
      // Ensure the dynamic import target exists virtually
      jest.doMock('risebot/risebot', () => ({ __esModule: true, default: 'RemoteRisebot' }), {
        virtual: true,
      });

      // Mock safeLazy but do not execute the factory here; we will inspect it
      jest.doMock('../../../utils/safeLazy', () => ({
        __esModule: true,
        default: jest.fn((f) => 'MockRisebotLazy'),
      }));

      require('../RisebotModule');
      safeLazy = require('../../../utils/safeLazy').default;
      factory = safeLazy.mock.calls[0][0];
    });

    // Factory should be callable and return a promise-like object
    expect(factory).toEqual(expect.any(Function));
    const result = factory();
    expect(result && typeof result.then).toBe('function');
  });
});
