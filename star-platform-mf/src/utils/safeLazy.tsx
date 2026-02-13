import React, { lazy } from 'react';
import ModuleHOC from './ModuleHOC';
import { loadRemoteModule } from './loadRemoteModule';

export function safeLazy(remoteName: string, remoteUrl: string, modulePath: string) {
  console.log('remoteUrl = ', remoteUrl);
  const Component = lazy(() =>
    loadRemoteModule(remoteName, remoteUrl, modulePath)
      .then((m) => m)
      .catch(() => ({
        default: () => (
          <div style={{ padding: 20, color: 'red', fontSize: 15 }}>
            Failed to load remote module. Please try again later.
          </div>
        ),
      }))
  );

  return ModuleHOC(Component);
}
