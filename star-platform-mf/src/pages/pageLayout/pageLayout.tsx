import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Login } from '../login/Login';
import Logout from '../logout/Logout';
import styles from '../../styles/layout.module.scss';
import { CircleLoader } from 'react-spinners';
import Sessionexpired from "../Session-expired/SessionExpired"
const cookies = new Cookies();

const PageLayout = ({ children }: any) => {
  const { instance, inProgress, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  // These flags help avoid rendering the app before MSAL finishes its work
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isTokenAvailable, setIsTokenAvailable] = useState(false);

  const Loader = (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircleLoader color="#825bff" />
    </div>
  );

  /**
   * This function handles:
   * 1. Making sure MSAL is initialized
   * 2. Ensuring we always have an active account
   * 3. Pulling fresh tokens silently whenever possible
   * 4. Updating both cookies and sessionStorage so remotes can authenticate
   */
  const generateToken = async () => {
    const instance1 = await instance.initialize();
    console.log('instance>>', instance1);

    // Pick the first available account if none is active yet
    const allAccounts = instance.getAllAccounts();
    console.log('allAccounts>>', allAccounts);
    if (!instance.getActiveAccount() && allAccounts.length > 0) {
      instance.setActiveAccount(allAccounts[0]);
    }
    console.log('isAuthenticated>>', isAuthenticated);
    if (!isAuthenticated) return;

    const request = {
      scopes: [], // No special scopes needed for this project
      account: accounts[0],
    };

    if (accounts.length === 0) return;

    await instance
      .acquireTokenSilent(request)
      .then((response: any) => {
        console.log('response = ', response);
        if (!response?.accessToken) {
          setIsTokenAvailable(false);
          cookies.set('isAuthenticated', false);
          return;
        }

        // Store ID token for standalone & remote MF usage
        sessionStorage.setItem('msal_id_token', response.idToken);
        sessionStorage.setItem('msal_access_token', response.accessToken);

        console.log('cookies = ', cookies);
        // Store access token in cookie so backend services can read it

        if (window.location.hostname.includes('localhost')) {
          cookies.set('iasphere_access_token', response.idToken);
        } else {
          cookies.set('iasphere_access_token', response.idToken, {
            secure: true,
            httpOnly: false,
            domain: '.ias.apps.jnj.com',
            expires: response.expiresIn,
          });
        }

        // Decode roles and user info for permission mapping
        const decodedId: any = jwtDecode(response.idToken);
        const decodedAccess: any = jwtDecode(response.accessToken);
        console.log('response decodedId  = ', decodedId?.roles);
        console.log('response decodedAccess  = ', decodedAccess);

        // cookies.set("iasphere_permissions", JSON.stringify(decodedId?.roles ?? []));
        cookies.set('isAuthenticated', true);
        cookies.set('username', decodedAccess?.unique_name?.split('@')[0] || '');
        cookies.set(
          'user_fullname',
          `${decodedAccess?.given_name ?? ''} ${decodedAccess?.family_name ?? ''}`
        );

        // Token expiry is stored to check session validity later
        cookies.set('tokenValidity', response.expiresOn);

        setIsSessionReady(true);
        setIsTokenAvailable(true);
      })
      .catch(() => {
        // If silent token acquisition fails, force user to re-login
        setIsTokenAvailable(false);
        cookies.set('isAuthenticated', false);
      });
  };

  /**
   * Refresh token every 5 minutes.
   * MSAL handles the rotation internally, we just request a fresh copy.
   */
  useEffect(() => {
    generateToken();
    const intervalId = setInterval(generateToken, 300000); // 5 minutes
    return () => clearInterval(intervalId);
  }, [isAuthenticated, inProgress, instance]);

  // While MSAL is still booting, just show a loader
  if (inProgress === 'startup') {
    return Loader;
  }

  // Prevent UI flash when token is still being loaded
  if (!isSessionReady && !isTokenAvailable && isAuthenticated) {
    return Loader;
  }

  // Handle logout path cleanly
  if (window.location.pathname === '/logout') {
    return <Logout />;
  }

 if (window.location.pathname === '/session-expired') {
    return <Sessionexpired />;
  }
  // If not authenticated, send the user to the login flow
  if (!isAuthenticated) {
    return <Login />;
  }

  // If everything is ready, show the actual page
  return <div className={styles.pagelayout}>{children}</div>;
};

export default PageLayout;