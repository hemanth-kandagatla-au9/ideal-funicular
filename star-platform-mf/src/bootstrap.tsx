import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import {
  PublicClientApplication,
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionRequiredAuthError,
} from '@azure/msal-browser';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { msalConfig } from './utils/msalConfig';
import { MsalProvider } from '@azure/msal-react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import App from './App';
import './App.css';

// Flags for remotes
if (typeof window !== 'undefined') {
  (window as any).__POWERED_BY_IASPHERE__ = true;
  (window as any).__HOST_APP__ = true;
  console.log('Host: IASphere mode activated');
  console.log(process.env);
}

const msalInstance = new PublicClientApplication(msalConfig);

async function renderApp() {
  await msalInstance.initialize();

  // Handle redirect
  const redirectResponse = await msalInstance.handleRedirectPromise();
  if (redirectResponse?.account) {
    msalInstance.setActiveAccount(redirectResponse.account);
  }

  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0 && !msalInstance.getActiveAccount()) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS) {
      msalInstance.setActiveAccount((event.payload as AuthenticationResult).account);
    }
  });

  const activeAccount = msalInstance.getActiveAccount();

  if (!activeAccount) {
    console.warn('No account — redirecting to login');
    msalInstance.loginRedirect({ scopes: ['User.Read', 'profile', 'email'] });
    return;
  }

  // LIVE, ASYNC, AUTO-REFRESHING
  (window as any).__HOST_GET_TOKEN__ = async (): Promise<string | null> => {
    try {
      const response = await msalInstance.acquireTokenSilent({
        scopes: ['User.Read', 'profile', 'email'],
        account: activeAccount,
        forceRefresh: false,
      });

      // Update storage for standalone fallback
      sessionStorage.setItem('msal_access_token', response.accessToken);
      sessionStorage.setItem('msal_id_token', response.idToken);

      return response.accessToken;
    } catch (error) {
      console.warn('Silent token failed — falling back to popup', error);

      // This triggers interactive re-auth without page reload
      try {
        const popupResponse = await msalInstance.acquireTokenPopup({
          scopes: ['User.Read', 'profile', 'email'],
          account: activeAccount,
        });
        sessionStorage.setItem('msal_access_token', popupResponse.accessToken);
        return popupResponse.accessToken;
      } catch (popupError) {
        console.error('All token methods failed', popupError);
        msalInstance.loginRedirect();
        return null;
      }
    }
  };

  // Pre-warm token so first remote load is instant
  await (window as any).__HOST_GET_TOKEN__();

  // Bridge tokens for Insight Remote MF (non-breaking)
  const existingGetToken = (window as any).__HOST_GET_TOKEN__;
  (window as any).__HOST_GET_INSIGHTS_TOKEN__ = async () => {
    const token = await existingGetToken?.();

    (window as any).__INSIGHTS_AUTH__ = {
      idToken: sessionStorage.getItem('msal_id_token') || null,
      accessToken: sessionStorage.getItem('msal_access_token') || token || null,
    };

    return (window as any).__INSIGHTS_AUTH__.accessToken;
  };

  // Run once immediately so remote MF gets the tokens upfront
  await (window as any).__HOST_GET_INSIGHTS_TOKEN__();
  console.log('Insights Token Bridge Initialized');

  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MsalProvider instance={msalInstance}>
          <Router>
            <App instance={msalInstance} />
          </Router>
        </MsalProvider>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );
}

renderApp().catch(console.error);
