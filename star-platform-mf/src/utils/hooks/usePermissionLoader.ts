    import { useEffect, useRef } from 'react';
    import { useDispatch, useSelector } from 'react-redux';
    import { setPermissions } from '../../redux/slices/permissionSlice';
    import { getUserPermissions } from '../../services/userServices';
    import { RootState } from '../../redux/store';

    export const usePermissionLoader = () => {
    const dispatch = useDispatch();
    const { permissions, loaded } = useSelector((state: RootState) => state.permissions);
    const fetchAttemptedRef = useRef(false);

    useEffect(() => {
        // Only attempt to fetch once per component mount
        if (fetchAttemptedRef.current) {
        return;
        }

        // If already loaded with permissions, skip fetch
        if (loaded && permissions && permissions.length > 0) {
        return;
        }

        fetchAttemptedRef.current = true;

        const fetchPermissions = async () => {
        try {
            const data = await getUserPermissions();
            console.log('=== FULL API RESPONSE ===', data);
            console.log('API Response Structure:', JSON.stringify(data, null, 2));
            
            // Extract permissions from the response
            let permissionsToSet: any[] = [];
            
            if (data?.data?.permissions && Array.isArray(data.data.permissions)) {
            permissionsToSet = data.data.permissions;
            console.log('Found permissions in data.data.permissions');
            } else if (Array.isArray(data)) {
            permissionsToSet = data;
            console.log('Response is already an array');
            } else if (data?.permissions && Array.isArray(data.permissions)) {
            permissionsToSet = data.permissions;
            console.log('Found permissions in data.permissions');
            } else {
            console.warn('Unexpected permissions format. Received:', data);
            permissionsToSet = [];
            }
            
            // Log detailed permission structure
            console.log('Permissions to set:', permissionsToSet);
            if (permissionsToSet.length > 0) {
              console.log('First permission item:', JSON.stringify(permissionsToSet[0], null, 2));
              console.log('All projects in permissions:', permissionsToSet.map((p: any) => p.project));
              permissionsToSet.forEach((proj: any) => {
                console.log(`Project: ${proj.project}`, {
                  modules: proj.modules?.map((m: any) => ({ module: m.module, hasAccess: m.hasAccess }))
                });
              });
            }
            
            dispatch(setPermissions(permissionsToSet));
        } catch (error) {
            console.error('❌ Error fetching permissions:', error);
            // Still dispatch empty array to mark as loaded
            dispatch(setPermissions([]));
        }
        };

        fetchPermissions();
    }, []); // Empty dependency array - run only once on mount

    return { permissions, loaded };
    };

  