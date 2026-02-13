// type Env = "local" | "predev" | "dev" | "qa";

// interface RemoteMap {
//   local: string;
//   predev: string;
//   dev?: string;
//   qa?: string;
// }

// /**
//  * Resolves the correct remoteEntry URL.
//  *
//  * @param remotes - URLs per environment
//  * @param forcePredev - if true, predev URL is used even on localhost
//  */
// export function resolveRemoteUrl(
//   remotes: RemoteMap,
//   forcePredev: boolean = false
// ): string {
//   const host = window.location.hostname;

//   // 🔹 Explicit override (used for local testing with predev)
//   if (forcePredev) {
//     return remotes.predev;
//   }

//   // 🔹 Normal runtime detection
//   if (host === "localhost" || host.startsWith("localhost")) {
//     return remotes.local;
//   }

//   if (host.startsWith("predev.")) {
//     return remotes.predev;
//   }

//   if (host.startsWith("dev.") && remotes.dev) {
//     return remotes.dev;
//   }

//   if (host.startsWith("qa.") && remotes.qa) {
//     return remotes.qa;
//   }

//   throw new Error(`Unsupported environment for host: ${host}`);
// }

export type Env = 'local' | 'predev' | 'dev' | 'qa' | 'prod';

export interface RemoteMap {
  local: string;
  predev: string;
  dev: string;
  qa: string;
  prod?: string;
}

/**
 * Resolves the correct remoteEntry URL based on REACT_APP_ENV
 *
 * @param remotes - map of env → remoteEntry URL
 * @param forcePredev - override for testing predev from local
 */
export function resolveRemoteUrl(remotes: RemoteMap, forcePredev: boolean = false): string {
  const env = process.env.REACT_APP_ENV as Env;
  console.log('env = ', env, remotes);
  if (!env) {
    throw new Error('REACT_APP_ENV is not defined');
  }

  // Explicit override (only for local testing)
  if (forcePredev) {
    return remotes.predev;
  }

  const url = remotes[env];

  if (!url) {
    throw new Error(`No remote URL configured for env: ${env}`);
  }

  return url;
}
