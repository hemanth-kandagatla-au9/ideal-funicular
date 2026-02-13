import { LogLevel } from '@azure/msal-browser';
export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENTID || '',
    authority: process.env.REACT_APP_AUTHORITY_URL || '',
    redirectUri: process.env.REACT_APP_REDIRECTURI || '',
    postLogoutRedirectUri: process.env.REACT_APP_POSTLOGOUTREDIRECTURI || '',
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: [],
};
