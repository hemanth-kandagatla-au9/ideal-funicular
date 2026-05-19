// src/pages/remotes/__tests__/InsightsApp.test.js

import path from 'path';

describe('Insights remotes lazy loader', () => {
  const moduleDir = path.join(__dirname, '..'); // points to: src/pages/remotes
  const insightsAppPath = require.resolve(path.join(moduleDir, 'InsightsApp'));
  const safeLazyPath = require.resolve(path.join(moduleDir, '..', '..', 'utils', 'safeLazy'));

  const dynamicModules = [
    'Insights/AuditLogs',
    'Insights/RequestStatus',
    'Insights/SapFacts',
    'Insights/RequestApproval',
    'Insights/Cmdb',
    'Insights/Users',
    'Insights/Codemarketplace',
    'Insights/Report',
    'Insights/Settings',
    'Insights/Schedule',
  ];

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('calls safeLazy 10 times with import factories and exports their return values', () => {
    let exported;
    let safeLazy;

    jest.isolateModules(() => {
      // Provide virtual modules for all dynamic imports so factories can be invoked safely if needed
      for (const mod of dynamicModules) {
        jest.doMock(mod, () => ({ __esModule: true, default: `${mod}-Default` }), {
          virtual: true,
        });
      }

      // Mock safeLazy to return distinct values per export in declared order
      jest.doMock(safeLazyPath, () => ({
        __esModule: true,
        default: jest
          .fn()
          .mockImplementationOnce(() => 'Mock_AuditLogs')
          .mockImplementationOnce(() => 'Mock_Approvalstatus')
          .mockImplementationOnce(() => 'Mock_SapFacts')
          .mockImplementationOnce(() => 'Mock_RequestApproval')
          .mockImplementationOnce(() => 'Mock_Cmdb')
          .mockImplementationOnce(() => 'Mock_Users')
          .mockImplementationOnce(() => 'Mock_Codemarketplace')
          .mockImplementationOnce(() => 'Mock_Report')
          .mockImplementationOnce(() => 'Mock_Ins_Settings')
          .mockImplementationOnce(() => 'Mock_Schedule'),
      }));

      exported = require(insightsAppPath);
      safeLazy = require(safeLazyPath).default;
    });

    // safeLazy called once per exported remote (10 total)
    expect(safeLazy).toHaveBeenCalledTimes(10);

    // Each call should receive a function (the dynamic import factory)
    for (const call of safeLazy.mock.calls) {
      const [factory] = call;
      expect(typeof factory).toBe('function');
    }

    // Exports equal the return values from the mock, in the same order as the file
    expect(exported.AuditLogs).toBe('Mock_AuditLogs');
    expect(exported.Approvalstatus).toBe('Mock_Approvalstatus');
    expect(exported.SapFacts).toBe('Mock_SapFacts');
    expect(exported.RequestApproval).toBe('Mock_RequestApproval');
    expect(exported.Cmdb).toBe('Mock_Cmdb');
    expect(exported.Users).toBe('Mock_Users');
    expect(exported.Codemarketplace).toBe('Mock_Codemarketplace');
    expect(exported.Report).toBe('Mock_Report');
    expect(exported.Ins_Settings).toBe('Mock_Ins_Settings');
    expect(exported.Schedule).toBe('Mock_Schedule');
  });

  it('exposes factories that return thenables (promise-like) when invoked', () => {
    let safeLazy;
    let capturedFactories = [];

    jest.isolateModules(() => {
      // Mock dynamic import targets (virtual), so import() yields a promise
      for (const mod of dynamicModules) {
        jest.doMock(mod, () => ({ __esModule: true, default: `${mod}-Default` }), {
          virtual: true,
        });
      }

      // Mock safeLazy but capture factories without invoking them here
      jest.doMock(safeLazyPath, () => ({
        __esModule: true,
        default: jest.fn((factory) => {
          capturedFactories.push(factory);
          return 'Mocked';
        }),
      }));

      require(insightsAppPath);
      safeLazy = require(safeLazyPath).default;
    });

    expect(safeLazy).toHaveBeenCalledTimes(10);
    expect(capturedFactories).toHaveLength(10);

    // Each captured factory should return a promise-like object
    for (const factory of capturedFactories) {
      expect(factory).toEqual(expect.any(Function));
      const result = factory();
      expect(result && typeof result.then).toBe('function');
    }
  });
});
