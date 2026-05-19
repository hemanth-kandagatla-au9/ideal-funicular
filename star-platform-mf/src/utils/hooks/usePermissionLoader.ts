// import { useCallback, useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setPermissions } from '../../redux/slices/permissionSlice';
// import { getUserPermissions } from '../../services/userServices';
// import { RootState } from '../../redux/store';
// import { normalizePermissions } from '../permissionUtil';
// import {authBootstrapState} from '../AuthBootstrap';
// export const usePermissionLoader = (enabled = true) => {
//   const dispatch = useDispatch();
//   const { permissions, loaded } = useSelector((state: RootState) => state.permissions);
//   const fetchedRef = useRef(false);

//   const refreshPermissions = useCallback(async () => {
//     try {

//       const data = await getUserPermissions();
//       if (data == null) return false;
//       const permissionsToSet = normalizePermissions(data);
//       dispatch(setPermissions(permissionsToSet));
//       return true;
//     } catch (error) {
//       console.error('Failed to load permissions', error);
//       dispatch(setPermissions([]));
//       return true;
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (!enabled) return;
// // if (!authBootstrapState.ready) return;
//     if (fetchedRef.current) return;

//     let isMounted = true;
//     const tryLoad = async () => {
//       if (!isMounted || fetchedRef.current) return;
//       const done = await refreshPermissions();
//       if (done && isMounted) {
//         fetchedRef.current = true;
//       }
//     };

//     tryLoad();
//     const intervalId = window.setInterval(tryLoad, 10000);
//     return () => {
//       isMounted = false;
//       window.clearInterval(intervalId);
//     };
//   }, [enabled, refreshPermissions]);

//   return { permissions, loaded, refreshPermissions };
// };
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPermissions, setPermissionsError } from '../../redux/slices/permissionSlice';
import { getUserPermissions } from '../../services/userServices';
import { RootState } from '../../redux/store';
import { normalizePermissions } from '../permissionUtil';
import { authBootstrapState } from '../AuthBootstrap';

export const usePermissionLoader = (enabled = true) => {
  const dispatch = useDispatch();
  const { permissions, loaded } = useSelector((state: RootState) => state.permissions);

  const fetchedRef = useRef(false);

  // host/src/utils/hooks/usePermissionLoader.ts
  const refreshPermissions = useCallback(async () => {
    try {
      const data = await getUserPermissions();
      if (data == null) return false;

      const permissionsToSet = normalizePermissions(data);
      dispatch(setPermissions(permissionsToSet));

      // 👇 bridge raw permissions to window for insights to pick up
      (window as any).__INSIGHTS_PERMISSIONS__ = data;
      window.dispatchEvent(new Event('INSIGHTS_PERMISSIONS_READY'));

      return true;
    } catch (error) {
      dispatch(setPermissionsError());
      return true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (!enabled) return;
    if (fetchedRef.current) return;

    let cancelled = false;

    const loadPermissions = async () => {
      if (cancelled || fetchedRef.current) return;

      const done = await refreshPermissions();

      if (done && !cancelled) {
        fetchedRef.current = true;
      }
    };

    // If backend login already completed
    if (authBootstrapState.ready) {
      loadPermissions();
      return;
    }

    // Otherwise wait for bootstrap event
    const handleBootstrapReady = () => {
      loadPermissions();
    };

    window.addEventListener('IAS_AUTH_READY', handleBootstrapReady);

    return () => {
      cancelled = true;
      window.removeEventListener('IAS_AUTH_READY', handleBootstrapReady);
    };
  }, [enabled, refreshPermissions]);

  return { permissions, loaded, refreshPermissions };
};
