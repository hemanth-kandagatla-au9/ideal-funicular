// src/pages/remotes/__tests__/WorflowRemote.test.js

const path = require('path');

describe('WorflowRemote lazy loaders', () => {
  const moduleDir = path.join(__dirname, '..'); // src/pages/remotes
  const worflowRemotePath = require.resolve(path.join(moduleDir, 'WorflowRemote'));
  const safeLazyPath = require.resolve(path.join(moduleDir, '..', '..', 'utils', 'safeLazy'));

  const dynamicModules = [
    'workflow/DashboardJNJ',
    'workflow/Execution',
    'workflow/Settings',
    'workflow/Capability',
    'workflow/Metrics',
    'workflow/NodeManagement',
    'workflow/Approvalrequest',
    'workflow/AuditLogs',
    'workflow/WorkflowCreation',
    'workflow/ExecutionViewPage',
    'workflow/AddWorkflowPage',
    'workflow/HelpContent',
  ];

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('calls safeLazy 12 times with import factories and exports their return values', () => {
    let exported;
    let safeLazy;

    jest.isolateModules(() => {
      // Provide virtual modules for all dynamic imports so factories can be invoked safely if needed
      for (const mod of dynamicModules) {
        jest.doMock(mod, () => ({ __esModule: true, default: `${mod}-Default` }), {
          virtual: true,
        });
      }

      // Mock safeLazy to return distinct values per export in the declared order
      jest.doMock(safeLazyPath, () => ({
        __esModule: true,
        default: jest
          .fn()
          .mockImplementationOnce(() => 'Mock_DashboardJNJ')
          .mockImplementationOnce(() => 'Mock_Execution')
          .mockImplementationOnce(() => 'Mock_Settings')
          .mockImplementationOnce(() => 'Mock_Capability')
          .mockImplementationOnce(() => 'Mock_Metrics')
          .mockImplementationOnce(() => 'Mock_NodeManagement')
          .mockImplementationOnce(() => 'Mock_Approvalrequest')
          .mockImplementationOnce(() => 'Mock_AuditLogsPage')
          .mockImplementationOnce(() => 'Mock_WorkflowCreation')
          .mockImplementationOnce(() => 'Mock_ExecutionViewPage')
          .mockImplementationOnce(() => 'Mock_AddWorkflowPage')
          .mockImplementationOnce(() => 'Mock_HelpContent'),
      }));

      exported = require(worflowRemotePath);
      safeLazy = require(safeLazyPath).default;
    });

    // safeLazy called once per exported remote (12 total)
    expect(safeLazy).toHaveBeenCalledTimes(12);

    // Each call should receive a function (the dynamic import factory)
    for (const call of safeLazy.mock.calls) {
      const [factory] = call;
      expect(typeof factory).toBe('function');
    }

    // Exports equal the return values from the mock, in the same order as the file
    expect(exported.DashboardJNJ).toBe('Mock_DashboardJNJ');
    expect(exported.Execution).toBe('Mock_Execution');
    expect(exported.Settings).toBe('Mock_Settings');
    expect(exported.Capability).toBe('Mock_Capability');
    expect(exported.Metrics).toBe('Mock_Metrics');
    expect(exported.NodeManagement).toBe('Mock_NodeManagement');
    expect(exported.Approvalrequest).toBe('Mock_Approvalrequest');
    expect(exported.AuditLogsPage).toBe('Mock_AuditLogsPage');
    expect(exported.WorkflowCreation).toBe('Mock_WorkflowCreation');
    expect(exported.ExecutionViewPage).toBe('Mock_ExecutionViewPage');
    expect(exported.AddWorkflowPage).toBe('Mock_AddWorkflowPage');
    expect(exported.HelpContent).toBe('Mock_HelpContent');
  });

  it('exposes factories that return thenables (promise-like) when invoked', () => {
    let safeLazy;
    const capturedFactories = [];

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

      require(worflowRemotePath);
      safeLazy = require(safeLazyPath).default;
    });

    expect(safeLazy).toHaveBeenCalledTimes(12);
    expect(capturedFactories).toHaveLength(12);

    // Each captured factory should return a promise-like object
    for (const factory of capturedFactories) {
      expect(factory).toEqual(expect.any(Function));
      const result = factory();
      expect(result && typeof result.then).toBe('function');
    }
  });
});
