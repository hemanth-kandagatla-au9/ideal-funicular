import React from 'react';
import ModuleHOC from './ModuleHOC';

type ImportFn = () => Promise<unknown>;

type FederatedModule<T = React.ComponentType<any>> =
  | { default: T }
  | { default: { default: T } }
  | T;

function resolveComponent(module: FederatedModule): React.ComponentType<any> {
  // MF sometimes returns nested default: { default: { default: Component } }
  if ((module as any)?.default?.default) {
    return (module as any).default.default;
  }

  if ((module as any)?.default) {
    return (module as any).default;
  }

  return module as React.ComponentType<any>;
}

function load(importFn: ImportFn): Promise<{ default: React.ComponentType<any> }> {
  if (typeof importFn !== 'function') {
    return Promise.reject(new Error("safeLazy requires a function: () => import('remote/module')"));
  }

  return importFn().then((module: unknown) => {
    const Component = resolveComponent(module as FederatedModule);

    if (!Component) {
      throw new Error('Module Federation did not return a valid React component');
    }

    return { default: Component };
  });
}

export default function safeLazy(importFn: ImportFn) {
  const LazyComponent = React.lazy(() => load(importFn));
  return ModuleHOC(LazyComponent);
}
