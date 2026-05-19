import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import {
  PublicClientApplication,
  AuthenticationResult,
  EventMessage,
  EventType,
} from '@azure/msal-browser';
import { BrowserRouter as Router } from 'react-router-dom';
import { msalConfig } from './utils/msalConfig';
import { MsalProvider } from '@azure/msal-react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { registerMsalInstance } from './utils/tokenService';
import { initTokenBridge } from './utils/tokenBridge';
import App from './App';
import './App.css';

const IS_LOCALHOST =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

if (typeof window !== 'undefined') {
  (window as any).__POWERED_BY_IASPHERE__ = true;
  (window as any).__HOST_APP__ = true;
}

const msalInstance = new PublicClientApplication(msalConfig);
initTokenBridge(msalInstance);
console.log('✅ tokenBridge initialized:');

async function renderApp() {
  await msalInstance.initialize();

  try {
    const redirectResponse = await msalInstance.handleRedirectPromise();

    if (redirectResponse?.account) {
      msalInstance.setActiveAccount(redirectResponse.account);

      const savedUrl = sessionStorage.getItem('postLoginRedirect');
      if (savedUrl) {
        sessionStorage.removeItem('postLoginRedirect');
        window.location.href = savedUrl;
      } else {
        window.location.href = '/app/workflow';
      }
      return;
    }
  } catch (err) {
    console.error('handleRedirectPromise failed:', err);
    return;
  }

  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0 && !msalInstance.getActiveAccount()) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      msalInstance.setActiveAccount((event.payload as AuthenticationResult).account);
    }
  });

  registerMsalInstance(msalInstance);

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
