/* eslint-disable @typescript-eslint/no-explicit-any */
declare const window: any;

let containerInitialized = false;

export async function loadRemoteModule(remoteName: string, scope: string, module: string) {
  console.log('scope', scope);
  console.log(`Loading remote module: ${remoteName}/${module}`);
  try {
    // Load remote entry script if not exists
    if (!window[remoteName]) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = scope + '?v=' + Date.now();
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
        //Helps with dev cross-origin error overlay
        script.crossOrigin = 'anonymous';
      });
    }

    // Init share scope once
    if (!containerInitialized) {
      await __webpack_init_sharing__('default');
      containerInitialized = true;
    }

    await window[remoteName].init(__webpack_share_scopes__.default);

    const factory = await window[remoteName].get(module);
    const Module = factory();
    return Module;
  } catch (err) {
    console.error(`Failed to load remote module: ${remoteName}/${module}`, err);
    throw err;
  }
}
