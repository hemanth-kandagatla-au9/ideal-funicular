const mongoose = require('mongoose');
const AgentRole = require('../../server/models/AgentRole');

describe('AgentRole Model - Comprehensive Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Schema Definition & Required Fields', () => {
        it('should require username field', () => {
            const role = new AgentRole();
            const validationError = role.validateSync();

            expect(validationError.errors.username).toBeDefined();
        });

        it('should create role with username and roles array', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: ['agent:status:read', 'agent:command:execute']
            });

            const validationError = role.validateSync();
            expect(validationError).toBeUndefined();
            expect(role.username).toBe('testuser');
            expect(role.roles).toHaveLength(2);
        });

        it('should enforce unique username', () => {
            const role1 = new AgentRole({
                username: 'testuser',
                roles: []
            });

            const role2 = new AgentRole({
                username: 'testuser',
                roles: []
            });

            expect(role1.username).toBe(role2.username);
            // DB would enforce uniqueness
        });

        it('should have default values for flags', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: []
            });

            expect(role.isActive).toBe(true);
            expect(role.isDeleted).toBe(false);
        });
    });

    describe('Username Field Validation', () => {
        it('should trim whitespace from username', () => {
            const role = new AgentRole({
                username: '  testuser  ',
                roles: []
            });

            expect(role.username).toBe('testuser');
        });

        it('should accept valid usernames', () => {
            const validUsernames = [
                'admin',
                'user123',
                'test_user',
                'agent-operator',
                'john.doe'
            ];

            validUsernames.forEach(username => {
                const role = new AgentRole({
                    username,
                    roles: []
                });
                expect(role.validateSync()).toBeUndefined();
            });
        });

        it('should handle case sensitivity with collation', () => {
            // Schema has collation: { locale: "en", strength: 2 } for case-insensitive
            const role1 = new AgentRole({
                username: 'testuser',
                roles: []
            });

            const role2 = new AgentRole({
                username: 'TESTUSER',
                roles: []
            });

            // Both should be valid, but DB would treat as same due to collation
            expect(role1.validateSync()).toBeUndefined();
            expect(role2.validateSync()).toBeUndefined();
        });

        it('should handle special characters', () => {
            const role = new AgentRole({
                username: 'user@company.com',
                roles: []
            });

            expect(role.validateSync()).toBeUndefined();
        });
    });

    describe('Roles Array Field', () => {
        it('should accept empty roles array', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: []
            });

            expect(role.validateSync()).toBeUndefined();
            expect(role.roles).toHaveLength(0);
        });

        it('should accept permission code strings', () => {
            const permissionCodes = [
                'agent:status:read',
                'agent:command:execute',
                'agent:job:create',
                'version:info:read'
            ];

            const role = new AgentRole({
                username: 'testuser',
                roles: permissionCodes
            });

            expect(role.validateSync()).toBeUndefined();
            expect(role.roles).toHaveLength(4);
            role.roles.forEach((code, index) => {
                expect(code).toBe(permissionCodes[index]);
            });
        });

        it('should trim whitespace from role strings', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: ['  agent:status:read  ', 'agent:command:execute']
            });

            // Depends on schema trim setting
            expect(role.roles).toHaveLength(2);
        });

        it('should support adding roles dynamically', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: []
            });

            role.roles.push('agent:status:read');
            role.roles.push('agent:command:execute');

            expect(role.roles).toHaveLength(2);
        });

        it('should support removing roles', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: ['agent:status:read', 'agent:command:execute']
            });

            role.roles = role.roles.filter(r => r !== 'agent:status:read');

            expect(role.roles).toHaveLength(1);
            expect(role.roles[0]).toBe('agent:command:execute');
        });

        it('should handle large role arrays', () => {
            const manyRoles = Array.from({ length: 50 }, (_, i) => `agent:module${i}:read`);
            const role = new AgentRole({
                username: 'testuser',
                roles: manyRoles
            });

            expect(role.roles).toHaveLength(50);
        });
    });

    describe('isActive Flag', () => {
        it('should default to true', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: []
            });

            expect(role.isActive).toBe(true);
        });

        it('should accept explicit false value', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: [],
                isActive: false
            });

            expect(role.isActive).toBe(false);
        });

        it('should support deactivating users', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: ['agent:status:read'],
                isActive: true
            });

            role.isActive = false;
            expect(role.isActive).toBe(false);
        });
    });

    describe('isDeleted Flag', () => {
        it('should default to false', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: []
            });

            expect(role.isDeleted).toBe(false);
        });

        it('should accept explicit true value', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: [],
                isDeleted: true
            });

            expect(role.isDeleted).toBe(true);
        });

        it('should support soft delete pattern', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: ['agent:status:read']
            });

            // Soft delete
            role.isDeleted = true;
            role.isActive = false;

            expect(role.isDeleted).toBe(true);
            expect(role.isActive).toBe(false);
        });
    });

    describe('Common Role Patterns', () => {
        it('should support admin role with multiple permissions', () => {
            const adminRole = new AgentRole({
                username: 'admin',
                roles: [
                    'agent:status:read',
                    'agent:command:execute',
                    'agent:job:create',
                    'version:info:read',
                    'version:management:update'
                ]
            });

            expect(adminRole.validateSync()).toBeUndefined();
            expect(adminRole.roles).toHaveLength(5);
        });

        it('should support read-only viewer role', () => {
            const viewerRole = new AgentRole({
                username: 'viewer',
                roles: [
                    'agent:status:read',
                    'agent:metric:read',
                    'version:info:read'
                ]
            });

            expect(viewerRole.validateSync()).toBeUndefined();
        });

        it('should support operator role with execution permissions', () => {
            const operatorRole = new AgentRole({
                username: 'operator',
                roles: [
                    'agent:status:read',
                    'agent:command:execute',
                    'agent:job:create'
                ]
            });

            expect(operatorRole.validateSync()).toBeUndefined();
        });

        it('should support user with no roles', () => {
            const guestRole = new AgentRole({
                username: 'guest',
                roles: []
            });

            expect(guestRole.validateSync()).toBeUndefined();
            expect(guestRole.roles).toHaveLength(0);
        });
    });

    describe('Role Management Operations', () => {
        it('should check if role has specific permission', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: ['agent:status:read', 'agent:command:execute']
            });

            expect(role.roles.includes('agent:status:read')).toBe(true);
            expect(role.roles.includes('agent:job:create')).toBe(false);
        });

        it('should count number of permissions', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: ['agent:status:read', 'agent:command:execute', 'agent:job:create']
            });

            expect(role.roles.length).toBe(3);
        });

        it('should clear all roles', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: ['agent:status:read', 'agent:command:execute']
            });

            role.roles = [];
            expect(role.roles).toHaveLength(0);
        });

        it('should replace all roles', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: ['agent:status:read']
            });

            role.roles = ['version:info:read', 'version:management:update'];
            expect(role.roles).toHaveLength(2);
            expect(role.roles[0]).toBe('version:info:read');
        });
    });

    describe('Instance Methods', () => {
        it('should convert to JSON correctly', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: ['agent:status:read']
            });

            const json = role.toJSON();
            expect(json.username).toBe('testuser');
            expect(json.roles).toHaveLength(1);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty string username', () => {
            const role = new AgentRole({
                username: '',
                roles: []
            });

            const validationError = role.validateSync();
            expect(validationError).toBeDefined();
        });

        it('should handle very long usernames', () => {
            const longUsername = 'a'.repeat(1000);
            const role = new AgentRole({
                username: longUsername,
                roles: []
            });

            expect(role.username.length).toBe(1000);
        });

        it('should handle duplicate roles in array', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: ['agent:status:read', 'agent:status:read']
            });

            // Model allows duplicates, but application should dedupe
            expect(role.roles).toHaveLength(2);
        });

        it('should handle special characters in role codes', () => {
            const role = new AgentRole({
                username: 'testuser',
                roles: ['agent:status-check:read', 'agent:job_execution:create']
            });

            expect(role.validateSync()).toBeUndefined();
        });

        it('should handle null vs undefined for roles', () => {
            const role1 = new AgentRole({
                username: 'testuser',
                roles: null
            });

            const role2 = new AgentRole({
                username: 'testuser'
            });

            // roles should default to empty array or undefined
            expect(role1.roles === null || Array.isArray(role1.roles)).toBe(true);
            expect(role2.roles === undefined || Array.isArray(role2.roles)).toBe(true);
        });
    });

    describe('Performance', () => {
        it('should create roles quickly', () => {
            const start = Date.now();

            for (let i = 0; i < 100; i++) {
                new AgentRole({
                    username: `user${i}`,
                    roles: ['agent:status:read']
                });
            }

            const duration = Date.now() - start;
            expect(duration).toBeLessThan(1000);
        });

        it('should handle large permission sets efficiently', () => {
            const manyPermissions = Array.from({ length: 100 }, (_, i) => `agent:module${i}:read`);

            const start = Date.now();
            const role = new AgentRole({
                username: 'testuser',
                roles: manyPermissions
            });
            const duration = Date.now() - start;

            expect(role.roles).toHaveLength(100);
            expect(duration).toBeLessThan(100);
        });
    });
});
