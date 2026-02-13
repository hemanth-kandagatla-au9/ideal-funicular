import { loadRemoteModule } from '../loadRemoteModule';

describe('loadRemoteModule', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();

    // Setup window mock with script loading behavior
    (window as any).testRemote = {
      init: jest.fn(() => Promise.resolve()),
      get: jest.fn(() => Promise.resolve(() => ({ default: () => 'Test Component' }))),
    };

    // Mock document.createElement to simulate successful script loading
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'script') {
        // Simulate successful script load after a tick
        setTimeout(() => {
          if (element.onload) {
            (element.onload as any)(new Event('load'));
          }
        }, 0);
      }
      return element;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should load a remote module successfully', async () => {
    const remoteName = 'testRemote';
    const remoteUrl = 'http://localhost:3002/remoteEntry.js';
    const modulePath = './TestModule';

    const result = await loadRemoteModule(remoteName, remoteUrl, modulePath);

    expect(result).toBeDefined();
    expect((window as any).__webpack_init_sharing__).toHaveBeenCalled();
  });

  it('should handle errors when loading remote module fails', async () => {
    const remoteName = 'nonExistentRemote';
    const remoteUrl = 'http://localhost:3002/remoteEntry.js';
    const modulePath = './NonExistent';

    // Mock script load error
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = document.createElement(tagName) as any;
      if (tagName === 'script') {
        setTimeout(() => {
          if (element.onerror) {
            element.onerror(new Error('Script load failed'));
          }
        }, 0);
      }
      return element;
    });

    await expect(loadRemoteModule(remoteName, remoteUrl, modulePath)).rejects.toThrow();
  });
});
