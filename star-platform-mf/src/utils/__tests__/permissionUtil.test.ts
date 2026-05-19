import {
  normalizePermissions,
  hasPermission,
  PermissionProject,
  PermissionApiResponse,
} from '../permissionUtil';

describe('Permission Utils', () => {
  const mockPermissions: PermissionProject[] = [
    {
      project: 'Insights',
      modules: [
        {
          module: 'Dashboard',
          hasAccess: true,
          permissions: [
            { label: 'View', hasAccess: true },
            { label: 'Edit', hasAccess: false },
          ],
        },
        {
          module: 'Reports',
          hasAccess: false,
        },
      ],
    },
  ];

  const apiResponse: PermissionApiResponse = {
    data: {
      permissions: mockPermissions,
    },
  };

  // ---------- normalizePermissions ----------
  describe('normalizePermissions', () => {
    it('should return empty array for undefined', () => {
      expect(normalizePermissions(undefined)).toEqual([]);
    });

    it('should return array when payload is already array', () => {
      expect(normalizePermissions(mockPermissions)).toEqual(mockPermissions);
    });

    it('should extract permissions from API response', () => {
      expect(normalizePermissions(apiResponse)).toEqual(mockPermissions);
    });
  });

  // ---------- hasPermission ----------
  describe('hasPermission', () => {
    it('should return false when no permissions', () => {
      expect(hasPermission(undefined, 'Insights', 'Dashboard')).toBe(false);
    });

    it('should return false when project not found', () => {
      expect(hasPermission([], 'OtherProject', 'Dashboard')).toBe(false);
    });

    it('should return false when module not found', () => {
      expect(hasPermission(mockPermissions, 'Insights', 'UnknownModule')).toBe(false);
    });

    it('should return false when module hasAccess is false', () => {
      expect(hasPermission(mockPermissions, 'Insights', 'Reports')).toBe(false);
    });

    it('should return true when module hasAccess is true and no permissionLabel', () => {
      expect(hasPermission(mockPermissions, 'Insights', 'Dashboard')).toBe(true);
    });

    it('should return false when permissionLabel not found', () => {
      expect(hasPermission(mockPermissions, 'Insights', 'Dashboard', 'Delete')).toBe(false);
    });

    it('should return correct access for permissionLabel', () => {
      expect(hasPermission(mockPermissions, 'Insights', 'Dashboard', 'View')).toBe(true);

      expect(hasPermission(mockPermissions, 'Insights', 'Dashboard', 'Edit')).toBe(false);
    });
  });
});
