import React from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import {
  IPublicClientApplication,
  AccountInfo,
  InteractionRequiredAuthError,
} from '@azure/msal-browser';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Login } from '../login/Login';
import Logout from '../logout/Logout';
import styles from '../../styles/layout.module.scss';
import { CircleLoader } from 'react-spinners';
import Sessionexpired from '../Session-expired/SessionExpired';
import { loginInsights } from '../../services/userServices';
import { usePermissionLoader } from '../../utils/hooks/usePermissionLoader';

interface DecodedToken {
  exp: number;
  iat?: number;
  [key: string]: any;
}

const cookies = new Cookies();
const COOKIE_PATH = '/';

const REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 min
const FORCE_REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // force network refresh when < 5 min left
const MIN_REFRESH_MS = 60_000; // never schedule sooner than 1 min
const MAX_TRANSIENT_RETRIES = 3; // max retries on transient errors after ready
const TRANSIENT_RETRY_DELAY_MS = 30_000; // 30s between transient retries
const TOKEN_SCOPES = ['User.Read', 'profile', 'email'];

const isSecure = window.location.protocol === 'https:';
const cookieOptions = {
  path: COOKIE_PATH,
  secure: isSecure,
  sameSite: (isSecure ? 'none' : 'lax') as 'none' | 'lax',
};

// ── Helpers ────────────────────────────────────────────────────────────────

const getTokenExpiry = (token: string): { expiresAt: number; isExpired: boolean } | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const expiresAt = decoded.exp * 1000;
    return { expiresAt, isExpired: Date.now() >= expiresAt };
  } catch {
    return null;
  }
};

const storeUserInfoCookies = (
  idToken: string,
  accessToken: string,
  earliestExpiry: number
): void => {
  const decodedId: any = jwtDecode(idToken);
  const decodedAccess: any = jwtDecode(accessToken);

  cookies.set('isAuthenticated', 'true', cookieOptions);
  cookies.set('tokenValidity', earliestExpiry, cookieOptions);
  cookies.set('permissions', JSON.stringify(decodedId?.roles ?? []), cookieOptions);
  cookies.set('username', decodedAccess?.unique_name?.split('@')[0] ?? '', cookieOptions);
  cookies.set(
    'user_fullname',
    `${decodedAccess?.given_name ?? ''} ${decodedAccess?.family_name ?? ''}`.trim(),
    cookieOptions
  );
  cookies.set('user_email', decodedAccess?.upn ?? decodedAccess?.unique_name ?? '', cookieOptions);
};

const clearUserInfoCookies = (): void => {
  [
    'isAuthenticated',
    'tokenValidity',
    'permissions',
    'username',
    'user_fullname',
    'user_email',
  ].forEach((key) => cookies.remove(key, { path: COOKIE_PATH }));
};

const fetchAndStoreProfilePhoto = async (accessToken: string): Promise<void> => {
  if (localStorage.getItem('profile_image')) return;
  try {
    const res = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) {
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('profile_image', reader.result as string);
      };
      reader.readAsDataURL(blob);
    }
  } catch (err) {
    console.error('[PageLayout] fetchProfilePhoto failed:', err);
  }
};

/* ─── Refresh scheduling ────────────────────────────────────────────────── */
const computeRefreshIn = (timeUntilExpiry: number): number => {
  if (timeUntilExpiry > REFRESH_BUFFER_MS) {
    return Math.max(
      Math.min(Math.floor(timeUntilExpiry * 0.8), timeUntilExpiry - REFRESH_BUFFER_MS),
      MIN_REFRESH_MS
    );
  }
  return Math.max(Math.floor(timeUntilExpiry * 0.8), MIN_REFRESH_MS);
};

const acquireToken = async (instance: IPublicClientApplication, account: AccountInfo) => {
  const cached = await instance.acquireTokenSilent({
    scopes: TOKEN_SCOPES,
    account,
    forceRefresh: false,
  });
  //  await loginInsights({
  //       action: 'login',
  //       accessToken: cached.accessToken,
  //     });
  if (!cached.accessToken || !cached.idToken) return null;

  const accessInfo = getTokenExpiry(cached.accessToken);
  const idInfo = getTokenExpiry(cached.idToken);
  if (!accessInfo || !idInfo) return null;

  const earliestExpiry = Math.min(accessInfo.expiresAt, idInfo.expiresAt);
  const timeUntilExpiry = earliestExpiry - Date.now();

  if (timeUntilExpiry < FORCE_REFRESH_THRESHOLD_MS) {
    console.info('[PageLayout] Token near expiry — forcing MSAL network refresh');
    try {
      const fresh = await instance.acquireTokenSilent({
        scopes: TOKEN_SCOPES,
        account,
        forceRefresh: true,
      });

      //  await loginInsights({
      //   action: 'login',
      //   accessToken: fresh.accessToken,
      // });

      if (fresh.accessToken && fresh.idToken) return fresh;
      console.warn('[PageLayout] forceRefresh returned no tokens — using cached');
    } catch (forceErr) {
      // InteractionRequiredAuthError here means refresh token is gone
      // Re-throw so caller's catch handles it (loginRedirect path)
      if (forceErr instanceof InteractionRequiredAuthError) throw forceErr;
      console.warn(
        '[PageLayout] forceRefresh failed with non-interaction error — using cached:',
        forceErr
      );
    }
  }

  return cached;
};

// ── Component ──────────────────────────────────────────────────────────────

const PageLayout = ({ children }: any) => {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const { pathname } = useLocation();
  const [isReady, setIsReady] = useState(false);
  const isReadyRef = useRef(false);

  //   const shouldLoadPermissions = !["/session-expired", "/logout"].includes(pathname);

  // usePermissionLoader(shouldLoadPermissions);

  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const transientRetryRef = useRef(0);

  const clearTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  const loader = (
    <div
      style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <CircleLoader color="#825bff" />
    </div>
  );

  useEffect(() => {
    if (pathname === '/logout' || pathname === '/session-expired') return;
    if (!isAuthenticated || !accounts || accounts.length === 0) return;

    const setupRefresh = async (): Promise<void> => {
      try {
        if (!instance.getActiveAccount()) {
          instance.setActiveAccount(accounts[0]);
        }

        const response = await acquireToken(instance, accounts[0]);

        if (!response || !response.accessToken || !response.idToken) {
          throw new Error('No tokens returned from MSAL');
        }

        const accessInfo = getTokenExpiry(response.accessToken);
        const idInfo = getTokenExpiry(response.idToken);

        if (!accessInfo || !idInfo) throw new Error('Failed to decode tokens');
        if (accessInfo.isExpired) throw new Error('Access token expired');
        if (idInfo.isExpired) throw new Error('ID token expired');

        const earliestExpiry = Math.min(accessInfo.expiresAt, idInfo.expiresAt);
        const timeUntilExpiry = earliestExpiry - Date.now();

        if (timeUntilExpiry <= 0) {
          throw new Error(`Tokens expired at ${new Date(earliestExpiry).toISOString()}`);
        }

        storeUserInfoCookies(response.idToken, response.accessToken, earliestExpiry);
        fetchAndStoreProfilePhoto(response.accessToken); // non-blocking
        await loginInsights({
          action: 'login',
          accessToken: response.accessToken,
        });

        // usePermissionLoader(!['/session-expired', '/logout'].includes(location.pathname))
        window.dispatchEvent(new Event('IAS_AUTH_READY'));
        // authBootstrapState.true=true;
        setIsReady(true);
        isReadyRef.current = true;
        transientRetryRef.current = 0; // ✅ reset on successful auth

        const refreshIn = computeRefreshIn(timeUntilExpiry);
        console.info(
          `[PageLayout] Next refresh in ${Math.floor(refreshIn / 60_000)}m ${Math.floor((refreshIn % 60_000) / 1000)}s`
        );

        clearTimer();
        refreshTimerRef.current = setTimeout(setupRefresh, refreshIn);
      } catch (err: any) {
        console.error('[PageLayout] Token acquisition failed:', err.message ?? err);

        if (err instanceof InteractionRequiredAuthError) {
          clearUserInfoCookies();
          localStorage.removeItem('profile_image');
          instance.loginRedirect({ scopes: TOKEN_SCOPES });
          return;
        }

        if (!isReadyRef.current) {
          window.location.href = '/session-expired';
          return;
        }

        // ✅ Transient error after app was ready — retry with limit
        transientRetryRef.current += 1;

        if (transientRetryRef.current > MAX_TRANSIENT_RETRIES) {
          console.error(`[PageLayout] Giving up after ${MAX_TRANSIENT_RETRIES} transient retries`);
          clearUserInfoCookies();
          window.location.href = '/session-expired';
          return;
        }

        console.warn(
          `[PageLayout] Transient error — retry ${transientRetryRef.current}/${MAX_TRANSIENT_RETRIES} in ${TRANSIENT_RETRY_DELAY_MS / 1000}s`
        );
        clearTimer();
        refreshTimerRef.current = setTimeout(setupRefresh, TRANSIENT_RETRY_DELAY_MS);
      }
    };

    setupRefresh();

    return () => {
      clearTimer();
      transientRetryRef.current = 0;
    };
  }, [isAuthenticated, accounts, instance]);

  if (pathname === '/logout') return <Logout />;
  if (pathname === '/session-expired') return <Sessionexpired />;
  if (inProgress === 'startup') return loader;
  if (!isAuthenticated) return <Login />;
  if (!isReady) return loader;

  return <div className={styles.pagelayout}>{children}</div>;
};

export default PageLayout;
