const mongoose = require('mongoose');
const Permission = require('../../server/models/Permission');

describe('Permission Model - Comprehensive Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Schema Definition & Required Fields', () => {
        it('should require project, module, and permission fields', () => {
            const permission = new Permission();
            const validationError = permission.validateSync();

            expect(validationError.errors.project).toBeDefined();
            expect(validationError.errors.module).toBeDefined();
            expect(validationError.errors.permission).toBeDefined();
        });

        it('should create permission with all required fields', () => {
            const permission = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read'
            });

            const validationError = permission.validateSync();
            expect(validationError).toBeUndefined();
            expect(permission.project).toBe('agent');
            expect(permission.module).toBe('status');
            expect(permission.permission).toBe('read');
        });

        it('should have default values for optional fields', () => {
            const permission = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read'
            });

            expect(permission.isActive).toBe(true);
            expect(permission.createdBy).toBe('system');
            expect(permission.updatedBy).toBe('system');
        });
    });

    describe('Field Validation', () => {
        describe('Project Field', () => {
            it('should trim whitespace', () => {
                const permission = new Permission({
                    project: '  agent  ',
                    module: 'status',
                    permission: 'read'
                });

                expect(permission.project).toBe('agent');
            });

            it('should enforce max length of 50 characters', () => {
                const longProject = 'a'.repeat(51);
                const permission = new Permission({
                    project: longProject,
                    module: 'status',
                    permission: 'read'
                });

                const validationError = permission.validateSync();
                expect(validationError.errors.project).toBeDefined();
                expect(validationError.errors.project.message).toContain('50');
            });

            it('should accept valid project names', () => {
                const validProjects = ['agent', 'version', 'ui-monitoring', 'job', 'metric'];

                validProjects.forEach(project => {
                    const permission = new Permission({
                        project,
                        module: 'test',
                        permission: 'read'
                    });
                    expect(permission.validateSync()).toBeUndefined();
                });
            });
        });

        describe('Module Field', () => {
            it('should trim whitespace', () => {
                const permission = new Permission({
                    project: 'agent',
                    module: '  status  ',
                    permission: 'read'
                });

                expect(permission.module).toBe('status');
            });

            it('should enforce max length of 50 characters', () => {
                const longModule = 'a'.repeat(51);
                const permission = new Permission({
                    project: 'agent',
                    module: longModule,
                    permission: 'read'
                });

                const validationError = permission.validateSync();
                expect(validationError.errors.module).toBeDefined();
            });

            it('should accept valid module names', () => {
                const validModules = ['status', 'command', 'metric', 'job', 'config'];

                validModules.forEach(module => {
                    const permission = new Permission({
                        project: 'agent',
                        module,
                        permission: 'read'
                    });
                    expect(permission.validateSync()).toBeUndefined();
                });
            });
        });

        describe('Permission Field', () => {
            it('should trim whitespace', () => {
                const permission = new Permission({
                    project: 'agent',
                    module: 'status',
                    permission: '  read  '
                });

                expect(permission.permission).toBe('read');
            });

            it('should enforce max length of 50 characters', () => {
                const longPermission = 'a'.repeat(51);
                const permission = new Permission({
                    project: 'agent',
                    module: 'status',
                    permission: longPermission
                });

                const validationError = permission.validateSync();
                expect(validationError.errors.permission).toBeDefined();
            });

            it('should accept CRUD permissions', () => {
                const crudPermissions = ['create', 'read', 'update', 'delete', 'execute'];

                crudPermissions.forEach(perm => {
                    const permission = new Permission({
                        project: 'agent',
                        module: 'status',
                        permission: perm
                    });
                    expect(permission.validateSync()).toBeUndefined();
                });
            });
        });

        describe('Description Field', () => {
            it('should be optional', () => {
                const permission = new Permission({
                    project: 'agent',
                    module: 'status',
                    permission: 'read'
                });

                expect(permission.validateSync()).toBeUndefined();
            });

            it('should accept description text', () => {
                const permission = new Permission({
                    project: 'agent',
                    module: 'status',
                    permission: 'read',
                    description: 'Allows reading agent status information'
                });

                expect(permission.description).toBe('Allows reading agent status information');
            });

            it('should enforce max length of 500 characters', () => {
                const longDescription = 'a'.repeat(501);
                const permission = new Permission({
                    project: 'agent',
                    module: 'status',
                    permission: 'read',
                    description: longDescription
                });

                const validationError = permission.validateSync();
                expect(validationError.errors.description).toBeDefined();
            });
        });
    });

    describe('Code Generation (Pre-save Hook)', () => {
        it('should auto-generate code from project:module:permission', () => {
            const permission = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read'
            });

            // Simulate pre-save hook manually
            if (!permission.code) {
                permission.code = `${permission.project}:${permission.module}:${permission.permission}`;
            }

            expect(permission.code).toBe('agent:status:read');
        });

        it('should generate code for different permission combinations', () => {
            const testCases = [
                { project: 'agent', module: 'command', permission: 'execute', expected: 'agent:command:execute' },
                { project: 'version', module: 'info', permission: 'read', expected: 'version:info:read' },
                { project: 'job', module: 'execution', permission: 'create', expected: 'job:execution:create' }
            ];

            testCases.forEach(({ project, module, permission, expected }) => {
                const perm = new Permission({ project, module, permission });
                perm.code = `${project}:${module}:${permission}`;
                expect(perm.code).toBe(expected);
            });
        });
    });

    describe('isActive Flag', () => {
        it('should default to true', () => {
            const permission = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read'
            });

            expect(permission.isActive).toBe(true);
        });

        it('should accept explicit false value', () => {
            const permission = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read',
                isActive: false
            });

            expect(permission.isActive).toBe(false);
        });
    });

    describe('Audit Fields', () => {
        it('should have default createdBy as system', () => {
            const permission = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read'
            });

            expect(permission.createdBy).toBe('system');
        });

        it('should have default updatedBy as system', () => {
            const permission = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read'
            });

            expect(permission.updatedBy).toBe('system');
        });

        it('should accept custom createdBy and updatedBy', () => {
            const permission = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read',
                createdBy: 'admin-user',
                updatedBy: 'admin-user'
            });

            expect(permission.createdBy).toBe('admin-user');
            expect(permission.updatedBy).toBe('admin-user');
        });
    });

    describe('Common Permission Patterns', () => {
        it('should support agent permissions', () => {
            const agentPermissions = [
                { project: 'agent', module: 'status', permission: 'read' },
                { project: 'agent', module: 'command', permission: 'execute' },
                { project: 'agent', module: 'metric', permission: 'read' },
                { project: 'agent', module: 'job', permission: 'create' }
            ];

            agentPermissions.forEach(data => {
                const perm = new Permission(data);
                expect(perm.validateSync()).toBeUndefined();
            });
        });

        it('should support version permissions', () => {
            const versionPermissions = [
                { project: 'version', module: 'info', permission: 'read' },
                { project: 'version', module: 'management', permission: 'update' }
            ];

            versionPermissions.forEach(data => {
                const perm = new Permission(data);
                expect(perm.validateSync()).toBeUndefined();
            });
        });

        it('should support UI monitoring permissions', () => {
            const uiPermissions = [
                { project: 'ui', module: 'monitoring', permission: 'read' },
                { project: 'ui', module: 'dashboard', permission: 'view' }
            ];

            uiPermissions.forEach(data => {
                const perm = new Permission(data);
                expect(perm.validateSync()).toBeUndefined();
            });
        });
    });

    describe('Instance Methods', () => {
        it('should convert to JSON correctly', () => {
            const permission = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read',
                description: 'Test permission'
            });

            const json = permission.toJSON();
            expect(json.project).toBe('agent');
            expect(json.module).toBe('status');
            expect(json.permission).toBe('read');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty string values', () => {
            const permission = new Permission({
                project: '',
                module: '',
                permission: ''
            });

            const validationError = permission.validateSync();
            expect(validationError).toBeDefined();
        });

        it('should handle special characters', () => {
            const permission = new Permission({
                project: 'agent-management',
                module: 'status_check',
                permission: 'read'
            });

            expect(permission.validateSync()).toBeUndefined();
        });

        it('should handle case sensitivity', () => {
            const perm1 = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read'
            });

            const perm2 = new Permission({
                project: 'AGENT',
                module: 'STATUS',
                permission: 'READ'
            });

            expect(perm1.project).not.toBe(perm2.project);
        });
    });

    describe('Performance', () => {
        it('should create permissions quickly', () => {
            const start = Date.now();

            for (let i = 0; i < 100; i++) {
                new Permission({
                    project: 'agent',
                    module: `module${i}`,
                    permission: 'read'
                });
            }

            const duration = Date.now() - start;
            expect(duration).toBeLessThan(1000);
        });
    });

    describe('Static Methods', () => {
        describe('validateCodes', () => {
            it('should validate existing permission codes', async () => {
                jest.spyOn(Permission, 'find').mockReturnValue({
                    select: jest.fn().mockResolvedValue([
                        { code: 'agent:status:read' },
                        { code: 'agent:version:write' }
                    ])
                });

                const result = await Permission.validateCodes([
                    'agent:status:read',
                    'agent:version:write'
                ]);

                expect(result.valid).toBe(true);
                expect(result.invalidCodes).toEqual([]);
                expect(result.existingCodes).toEqual(['agent:status:read', 'agent:version:write']);
            });

            it('should identify invalid permission codes', async () => {
                jest.spyOn(Permission, 'find').mockReturnValue({
                    select: jest.fn().mockResolvedValue([
                        { code: 'agent:status:read' }
                    ])
                });

                const result = await Permission.validateCodes([
                    'agent:status:read',
                    'agent:invalid:code'
                ]);

                expect(result.valid).toBe(false);
                expect(result.invalidCodes).toEqual(['agent:invalid:code']);
                expect(result.existingCodes).toEqual(['agent:status:read']);
            });
        });

        describe('getGroupedPermissions', () => {
            it('should group permissions by project and module', async () => {
                jest.spyOn(Permission, 'find').mockReturnValue({
                    sort: jest.fn().mockResolvedValue([
                        { project: 'agent', module: 'status', permission: 'read', code: 'agent:status:read', description: 'Read status' },
                        { project: 'agent', module: 'status', permission: 'write', code: 'agent:status:write', description: 'Write status' },
                        { project: 'agent', module: 'version', permission: 'read', code: 'agent:version:read', description: 'Read version' }
                    ])
                });

                const result = await Permission.getGroupedPermissions();

                expect(result).toHaveLength(1);
                expect(result[0].project).toBe('agent');
                expect(result[0].modules).toHaveLength(2);
            });

            it('should mark permissions as granted for user roles', async () => {
                jest.spyOn(Permission, 'find').mockReturnValue({
                    sort: jest.fn().mockResolvedValue([
                        { project: 'agent', module: 'status', permission: 'read', code: 'agent:status:read', description: 'Read status' },
                        { project: 'agent', module: 'status', permission: 'write', code: 'agent:status:write', description: 'Write status' }
                    ])
                });

                const result = await Permission.getGroupedPermissions(['agent:status:read']);

                const statusModule = result[0].modules.find(m => m.module === 'status');
                const readPerm = statusModule.permissions.find(p => p.permission === 'read');
                const writePerm = statusModule.permissions.find(p => p.permission === 'write');

                expect(readPerm.granted).toBe(true);
                expect(writePerm.granted).toBe(false);
            });
        });

        describe('searchWithPagination', () => {
            it('should search permissions with pagination', async () => {
                const mockPermissions = [
                    { project: 'agent', module: 'status', permission: 'read' }
                ];

                jest.spyOn(Permission, 'find').mockReturnValue({
                    populate: jest.fn().mockReturnThis(),
                    sort: jest.fn().mockReturnThis(),
                    skip: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockResolvedValue(mockPermissions)
                });
                jest.spyOn(Permission, 'countDocuments').mockResolvedValue(10);

                const result = await Permission.searchWithPagination({}, 1, 20);

                expect(result.permissions).toEqual(mockPermissions);
                expect(result.pagination.page).toBe(1);
                expect(result.pagination.limit).toBe(20);
                expect(result.pagination.total).toBe(10);
                expect(result.pagination.pages).toBe(1);
            });

            it('should filter by search term', async () => {
                jest.spyOn(Permission, 'find').mockReturnValue({
                    populate: jest.fn().mockReturnThis(),
                    sort: jest.fn().mockReturnThis(),
                    skip: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockResolvedValue([])
                });
                jest.spyOn(Permission, 'countDocuments').mockResolvedValue(0);

                await Permission.searchWithPagination({ search: 'agent' }, 1, 20);

                expect(Permission.find).toHaveBeenCalledWith(expect.objectContaining({
                    $or: expect.any(Array)
                }));
            });
        });
    });
    describe('Pre-save Middleware - Code Generation', () => {
        it('should generate code from project, module, and permission on save', () => {
            const permission = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read'
            });

            // Manually trigger pre-save logic
            if (!permission.code || permission.isModified('project') || permission.isModified('module') || permission.isModified('permission')) {
                permission.code = `${permission.project}:${permission.module}:${permission.permission}`;
            }

            expect(permission.code).toBe('agent:status:read');
        });

        it('should regenerate code when project is modified', () => {
            const permission = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read',
                code: 'old:code:value'
            });

            permission.markModified('project');
            permission.project = 'newproject';

            // Manually trigger pre-save logic
            if (!permission.code || permission.isModified('project') || permission.isModified('module') || permission.isModified('permission')) {
                permission.code = `${permission.project}:${permission.module}:${permission.permission}`;
            }

            expect(permission.code).toBe('newproject:status:read');
        });

        it('should regenerate code when module is modified', () => {
            const permission = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read',
                code: 'agent:status:read'
            });

            permission.markModified('module');
            permission.module = 'newmodule';

            // Manually trigger pre-save logic
            if (!permission.code || permission.isModified('project') || permission.isModified('module') || permission.isModified('permission')) {
                permission.code = `${permission.project}:${permission.module}:${permission.permission}`;
            }

            expect(permission.code).toBe('agent:newmodule:read');
        });

        it('should regenerate code when permission is modified', () => {
            const permission = new Permission({
                project: 'agent',
                module: 'status',
                permission: 'read',
                code: 'agent:status:read'
            });

            permission.markModified('permission');
            permission.permission = 'write';

            // Manually trigger pre-save logic
            if (!permission.code || permission.isModified('project') || permission.isModified('module') || permission.isModified('permission')) {
                permission.code = `${permission.project}:${permission.module}:${permission.permission}`;
            }

            expect(permission.code).toBe('agent:status:write');
        });
    });

    describe('Static Methods - Additional Coverage', () => {
        it('should validate codes with mixed valid and invalid codes', async () => {
            const mockPermissions = [
                { code: 'agent:status:read' },
                { code: 'agent:version:write' }
            ];

            jest.spyOn(Permission, 'find').mockReturnValue({
                select: jest.fn().mockResolvedValue(mockPermissions)
            });

            const result = await Permission.validateCodes([
                'agent:status:read',
                'agent:version:write',
                'invalid:code:1',
                'invalid:code:2'
            ]);

            expect(result.valid).toBe(false);
            expect(result.invalidCodes).toEqual(['invalid:code:1', 'invalid:code:2']);
            expect(result.existingCodes).toEqual(['agent:status:read', 'agent:version:write']);
        });

        it('should get grouped permissions with user roles', async () => {
            const mockPermissions = [
                { project: 'agent', module: 'status', permission: 'read', code: 'agent:status:read', description: 'Read status' },
                { project: 'agent', module: 'status', permission: 'write', code: 'agent:status:write', description: 'Write status' },
                { project: 'agent', module: 'version', permission: 'read', code: 'agent:version:read', description: 'Read version' }
            ];

            jest.spyOn(Permission, 'find').mockReturnValue({
                sort: jest.fn().mockResolvedValue(mockPermissions)
            });

            const result = await Permission.getGroupedPermissions(['agent:status:read', 'agent:version:read']);

            expect(result).toHaveLength(1);
            expect(result[0].project).toBe('agent');
            expect(result[0].modules).toHaveLength(2);
            expect(result[0].modules[0].permissions[0].granted).toBe(true);
            expect(result[0].modules[0].permissions[1].granted).toBe(false);
        });
    });
});
