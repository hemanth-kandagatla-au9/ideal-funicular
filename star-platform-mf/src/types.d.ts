declare module 'cyberSphere/cybersphereModule' {
  const App: React.ComponentType;
  export default App;
}

declare module 'workFlow/App' {
  const App: React.ComponentType;
  export default App;
}
declare module 'remote3/App' {
  const App: React.ComponentType;
  export default App;
}
declare global {
  interface Window {
    workflow?: {
      init: (scope: any) => Promise<void>;
      get: (module: string) => Promise<any>;
    };
  }

  const __webpack_init_sharing__: (scope: string) => Promise<void>;
  const __webpack_share_scopes__: { default: any };
}

export {};
