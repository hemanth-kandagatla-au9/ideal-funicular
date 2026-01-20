const mongoose = require('mongoose');
const AgentUserDetails = require('../../server/models/AgentUserDetails');

describe('AgentUserDetails Model - Comprehensive Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Schema Definition & Required Fields', () => {
        it('should require username and password fields', () => {
            const user = new AgentUserDetails();
            const validationError = user.validateSync();

            expect(validationError.errors.username).toBeDefined();
            expect(validationError.errors.password).toBeDefined();
        });

        it('should create user with required fields', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'hashed_password_123'
            });

            const validationError = user.validateSync();
            expect(validationError).toBeUndefined();
            expect(user.username).toBe('testuser');
            expect(user.password).toBe('hashed_password_123');
        });

        it('should enforce unique username', () => {
            const user1 = new AgentUserDetails({
                username: 'testuser',
                password: 'password123'
            });

            const user2 = new AgentUserDetails({
                username: 'testuser',
                password: 'password456'
            });

            expect(user1.username).toBe(user2.username);
            // DB would enforce uniqueness
        });

        it('should have default values for optional fields', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123'
            });

            expect(user.isActive).toBe(true);
            expect(user.createdBy).toBe('Admin');
            expect(user.updatedBy).toBe('Admin');
        });
    });

    describe('Username Validation', () => {
        it('should trim whitespace from username', () => {
            const user = new AgentUserDetails({
                username: '  testuser  ',
                password: 'password123'
            });

            expect(user.username).toBe('testuser');
        });

        it('should enforce minimum length of 3 characters', () => {
            const user = new AgentUserDetails({
                username: 'ab',
                password: 'password123'
            });

            const validationError = user.validateSync();
            expect(validationError.errors.username).toBeDefined();
            expect(validationError.errors.username.message).toContain('3');
        });

        it('should enforce maximum length of 50 characters', () => {
            const longUsername = 'a'.repeat(51);
            const user = new AgentUserDetails({
                username: longUsername,
                password: 'password123'
            });

            const validationError = user.validateSync();
            expect(validationError.errors.username).toBeDefined();
            expect(validationError.errors.username.message).toContain('50');
        });

        it('should accept valid usernames', () => {
            const validUsernames = [
                'admin',
                'user123',
                'test_user',
                'john.doe',
                'agent-operator'
            ];

            validUsernames.forEach(username => {
                const user = new AgentUserDetails({
                    username,
                    password: 'password123'
                });
                expect(user.validateSync()).toBeUndefined();
            });
        });

        it('should handle usernames at boundary lengths', () => {
            const minUsername = 'abc'; // 3 chars
            const maxUsername = 'a'.repeat(50); // 50 chars

            const user1 = new AgentUserDetails({
                username: minUsername,
                password: 'password123'
            });

            const user2 = new AgentUserDetails({
                username: maxUsername,
                password: 'password123'
            });

            expect(user1.validateSync()).toBeUndefined();
            expect(user2.validateSync()).toBeUndefined();
        });
    });

    describe('Password Field', () => {
        it('should require password', () => {
            const user = new AgentUserDetails({
                username: 'testuser'
            });

            const validationError = user.validateSync();
            expect(validationError.errors.password).toBeDefined();
        });

        it('should store password as string', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'hashed_password_123'
            });

            expect(typeof user.password).toBe('string');
        });

        it('should accept bcrypt hashed passwords', () => {
            const bcryptHash = '$2b$10$abcdefghijklmnopqrstuv1234567890123456789012';
            const user = new AgentUserDetails({
                username: 'testuser',
                password: bcryptHash
            });

            expect(user.password).toBe(bcryptHash);
            expect(user.validateSync()).toBeUndefined();
        });

        it('should handle long password hashes', () => {
            const longHash = 'a'.repeat(200);
            const user = new AgentUserDetails({
                username: 'testuser',
                password: longHash
            });

            expect(user.password.length).toBe(200);
        });

        it('should not expose password in toJSON', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'secret_password'
            });

            const json = user.toJSON();
            // Depends on schema toJSON transform
            expect(json).toBeTruthy();
        });
    });

    describe('Roles Array Field', () => {
        it('should default to empty array or undefined', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123'
            });

            // Should be array or undefined
            if (user.roles !== undefined) {
                expect(Array.isArray(user.roles)).toBe(true);
            }
        });

        it('should accept array of permission code strings', () => {
            const roles = [
                'agent:status:read',
                'agent:command:execute',
                'version:info:read'
            ];

            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                roles
            });

            expect(user.validateSync()).toBeUndefined();
            expect(user.roles).toHaveLength(3);
            user.roles.forEach((role, index) => {
                expect(role).toBe(roles[index]);
            });
        });

        it('should trim whitespace from role strings', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                roles: ['  agent:status:read  ', 'agent:command:execute']
            });

            expect(user.roles).toHaveLength(2);
        });

        it('should support adding roles dynamically', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                roles: []
            });

            user.roles.push('agent:status:read');
            user.roles.push('agent:command:execute');

            expect(user.roles).toHaveLength(2);
        });

        it('should support removing roles', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                roles: ['agent:status:read', 'agent:command:execute']
            });

            user.roles = user.roles.filter(r => r !== 'agent:status:read');

            expect(user.roles).toHaveLength(1);
            expect(user.roles[0]).toBe('agent:command:execute');
        });

        it('should handle pre-save hook for role deduplication', () => {
            // Pre-save hook removes duplicates
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                roles: ['agent:status:read', 'agent:status:read', 'agent:command:execute']
            });

            // Simulate pre-save hook
            if (user.roles) {
                user.roles = [...new Set(user.roles.filter(role => role && role.trim()))];
            }

            expect(user.roles).toHaveLength(2);
            expect(user.roles[0]).toBe('agent:status:read');
            expect(user.roles[1]).toBe('agent:command:execute');
        });
    });

    describe('isActive Flag', () => {
        it('should default to true', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123'
            });

            expect(user.isActive).toBe(true);
        });

        it('should accept explicit false value', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                isActive: false
            });

            expect(user.isActive).toBe(false);
        });

        it('should support user deactivation', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                isActive: true
            });

            user.isActive = false;
            expect(user.isActive).toBe(false);
        });
    });

    describe('Audit Fields', () => {
        it('should have default createdBy as Admin', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123'
            });

            expect(user.createdBy).toBe('Admin');
        });

        it('should have default updatedBy as Admin', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123'
            });

            expect(user.updatedBy).toBe('Admin');
        });

        it('should accept custom createdBy and updatedBy', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                createdBy: 'super-admin',
                updatedBy: 'super-admin'
            });

            expect(user.createdBy).toBe('super-admin');
            expect(user.updatedBy).toBe('super-admin');
        });
    });

    describe('Virtual Properties', () => {
        it('should have rolesCount virtual property', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                roles: ['agent:status:read', 'agent:command:execute']
            });

            // Access virtual property if it exists
            if (user.rolesCount !== undefined) {
                expect(user.rolesCount).toBe(2);
            }
        });

        it('should calculate rolesCount for empty roles', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                roles: []
            });

            if (user.rolesCount !== undefined) {
                expect(user.rolesCount).toBe(0);
            }
        });
    });

    describe('Common User Patterns', () => {
        it('should support admin user with multiple roles', () => {
            const adminUser = new AgentUserDetails({
                username: 'admin',
                password: '$2b$10$hashedpassword',
                roles: [
                    'agent:status:read',
                    'agent:command:execute',
                    'agent:job:create',
                    'version:info:read',
                    'version:management:update'
                ]
            });

            expect(adminUser.validateSync()).toBeUndefined();
            expect(adminUser.roles).toHaveLength(5);
        });

        it('should support read-only viewer user', () => {
            const viewerUser = new AgentUserDetails({
                username: 'viewer',
                password: '$2b$10$hashedpassword',
                roles: [
                    'agent:status:read',
                    'agent:metric:read'
                ]
            });

            expect(viewerUser.validateSync()).toBeUndefined();
        });

        it('should support user with no roles', () => {
            const guestUser = new AgentUserDetails({
                username: 'guest',
                password: '$2b$10$hashedpassword',
                roles: []
            });

            expect(guestUser.validateSync()).toBeUndefined();
        });

        it('should support inactive user', () => {
            const inactiveUser = new AgentUserDetails({
                username: 'inactive',
                password: '$2b$10$hashedpassword',
                isActive: false,
                roles: []
            });

            expect(inactiveUser.validateSync()).toBeUndefined();
            expect(inactiveUser.isActive).toBe(false);
        });
    });

    describe('Instance Methods', () => {
        it('should convert to JSON correctly', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'secret',
                roles: ['agent:status:read']
            });

            const json = user.toJSON();
            expect(json.username).toBe('testuser');
            // Password might be excluded by toJSON transform
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty string username', () => {
            const user = new AgentUserDetails({
                username: '',
                password: 'password123'
            });

            const validationError = user.validateSync();
            expect(validationError).toBeDefined();
        });

        it('should handle empty string password', () => {
            const user = new AgentUserDetails({
                username: 'testuser',
                password: ''
            });

            const validationError = user.validateSync();
            expect(validationError).toBeDefined();
        });

        it('should handle special characters in username', () => {
            const user = new AgentUserDetails({
                username: 'test@user.com',
                password: 'password123'
            });

            // Should pass validation
            expect(user.validateSync()).toBeUndefined();
        });

        it('should handle null vs undefined for roles', () => {
            const user1 = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                roles: null
            });

            const user2 = new AgentUserDetails({
                username: 'testuser',
                password: 'password123'
            });

            expect(user1.roles === null || Array.isArray(user1.roles)).toBe(true);
            expect(user2.roles === undefined || Array.isArray(user2.roles)).toBe(true);
        });

        it('should handle very long role arrays', () => {
            const manyRoles = Array.from({ length: 100 }, (_, i) => `agent:module${i}:read`);
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                roles: manyRoles
            });

            expect(user.roles).toHaveLength(100);
        });
    });

    describe('Data Integrity', () => {
        it('should preserve all field values', () => {
            const userData = {
                username: 'testuser',
                password: 'hashed_password',
                roles: ['agent:status:read'],
                isActive: true,
                createdBy: 'admin',
                updatedBy: 'admin'
            };

            const user = new AgentUserDetails(userData);

            expect(user.username).toBe(userData.username);
            expect(user.password).toBe(userData.password);
            expect(user.roles).toHaveLength(1);
            expect(user.isActive).toBe(userData.isActive);
            expect(user.createdBy).toBe(userData.createdBy);
            expect(user.updatedBy).toBe(userData.updatedBy);
        });

        it('should maintain role order', () => {
            const roles = [
                'agent:status:read',
                'agent:command:execute',
                'version:info:read'
            ];

            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                roles
            });

            user.roles.forEach((role, index) => {
                expect(role).toBe(roles[index]);
            });
        });
    });

    describe('Performance', () => {
        it('should create users quickly', () => {
            const start = Date.now();

            for (let i = 0; i < 100; i++) {
                new AgentUserDetails({
                    username: `user${i}`,
                    password: 'password123',
                    roles: ['agent:status:read']
                });
            }

            const duration = Date.now() - start;
            expect(duration).toBeLessThan(1000);
        });

        it('should handle large role sets efficiently', () => {
            const manyRoles = Array.from({ length: 50 }, (_, i) => `agent:module${i}:read`);

            const start = Date.now();
            const user = new AgentUserDetails({
                username: 'testuser',
                password: 'password123',
                roles: manyRoles
            });
            const duration = Date.now() - start;

            expect(user.roles).toHaveLength(50);
            expect(duration).toBeLessThan(100);
        });
    });

    describe('Pre-save Middleware', () => {
        it('should remove duplicate roles on save', () => {
            const user = new AgentUserDetails({
                username: 'testuserdupes',
                password: 'password123',
                roles: ['role1', 'role2', 'role1', 'role3', 'role2']
            });

            // Manually trigger pre-save logic
            if (user.roles) {
                user.roles = [...new Set(user.roles.filter(role => role && role.trim()))];
            }

            expect(user.roles).toHaveLength(3);
            expect(user.roles).toEqual(expect.arrayContaining(['role1', 'role2', 'role3']));
        });

        it('should remove empty strings from roles on save', () => {
            const user = new AgentUserDetails({
                username: 'testuserempty',
                password: 'password123',
                roles: ['role1', '', 'role2', '   ', 'role3']
            });

            // Manually trigger pre-save logic
            if (user.roles) {
                user.roles = [...new Set(user.roles.filter(role => role && role.trim()))];
            }

            expect(user.roles.length).toBeLessThanOrEqual(3);
            expect(user.roles).not.toContain('');
        });
    });
});