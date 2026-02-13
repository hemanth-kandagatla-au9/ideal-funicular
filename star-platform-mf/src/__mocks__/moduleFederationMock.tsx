// Mock for webpack Module Federation
export const mockLoadRemoteModule = jest.fn((remoteName, remoteUrl, modulePath) => {
  return Promise.resolve({
    default: () => (
      <div data-testid={`remote-${remoteName}-${modulePath}`}>Mock Remote Component</div>
    ),
  });
});

jest.mock('../utils/loadRemoteModule', () => ({
  loadRemoteModule: mockLoadRemoteModule,
}));

// Mock webpack globals
(global as any).__webpack_init_sharing__ = jest.fn(() => Promise.resolve());
(global as any).__webpack_share_scopes__ = { default: {} };

export default mockLoadRemoteModule;
