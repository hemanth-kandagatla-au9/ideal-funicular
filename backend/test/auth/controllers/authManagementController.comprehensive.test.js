const {
    getUserDetails,
    getPermissions,
    addUser,
    addPermission,
    deleteUserDetails,
    updatePermission,
    assignUserPermissions
} = require('../../../server/auth/controllers/authManagementController');
const agentUserDetails = require('../../../server/models/AgentUserDetails');
const Permission = require('../../../server/models/Permission');
const bcrypt = require('bcrypt');
const responseCodes = require('../../../server/utils/responseCodes');

// Mock dependencies
jest.mock('../../../server/models/AgentUserDetails');
jest.mock('../../../server/models/Permission');
jest.mock('bcrypt');

describe('AuthManagementController - Comprehensive Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            query: {},
            params: {},
            user: { id: 'admin-user-id' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('getUserDetails', () => {
        it('should get all users with default pagination', async () => {
            const mockUsers = [
                { username: 'user1', isActive: true, createdAt: new Date() },
                { username: 'user2', isActive: true, createdAt: new Date() }
            ];

            agentUserDetails.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockUsers)
            });
            agentUserDetails.countDocuments = jest.fn().mockResolvedValue(2);

            await getUserDetails(req, res);

            expect(agentUserDetails.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    flag: 'success'
                })
            );
        });

        it('should filter users by search term', async () => {
            req.query = { search: 'test', page: 1, limit: 20 };

            agentUserDetails.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue([])
            });
            agentUserDetails.countDocuments = jest.fn().mockResolvedValue(0);

            await getUserDetails(req, res);

            expect(agentUserDetails.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    username: expect.objectContaining({ $regex: 'test' })
                })
            );
        });

        it('should filter by isActive status', async () => {
            req.query = { isActive: 'true' };

            agentUserDetails.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue([])
            });
            agentUserDetails.countDocuments = jest.fn().mockResolvedValue(0);

            await getUserDetails(req, res);

            expect(agentUserDetails.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    isActive: true
                })
            );
        });

        it('should handle errors gracefully', async () => {
            agentUserDetails.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockRejectedValue(new Error('Database error'))
            });

            await getUserDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    flag: 'error'
                })
            );
        });
    });

    describe('addUser', () => {
        it('should create a new user successfully', async () => {
            req.body = {
                username: 'newuser',
                password: 'Password123'
            };

            agentUserDetails.findOne = jest.fn().mockResolvedValue(null);
            bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
            agentUserDetails.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue({
                    _id: 'user-id',
                    username: 'newuser'
                })
            }));

            await addUser(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 10);
            expect(res.status).toHaveBeenCalledWith(responseCodes.CREATED);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    flag: 'success'
                })
            );
        });

        it('should return error when username is missing', async () => {
            req.body = { password: 'Password123' };

            await addUser(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.ERROR);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    flag: 'error',
                    error: 'Username and password are required'
                })
            );
        });

        it('should return error when password is missing', async () => {
            req.body = { username: 'newuser' };

            await addUser(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.ERROR);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Username and password are required'
                })
            );
        });

        it('should validate username format', async () => {
            req.body = {
                username: 'ab', // Too short
                password: 'Password123'
            };

            await addUser(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.ERROR);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.stringContaining('3-50 characters')
                })
            );
        });

        it('should validate password strength', async () => {
            req.body = {
                username: 'newuser',
                password: 'weak' // Too short
            };

            await addUser(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.ERROR);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.stringContaining('at least 8 characters')
                })
            );
        });

        it('should return error when username already exists', async () => {
            req.body = {
                username: 'existinguser',
                password: 'Password123'
            };

            agentUserDetails.findOne = jest.fn().mockResolvedValue({
                username: 'existinguser'
            });

            await addUser(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.EXISTS);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Username already exists'
                })
            );
        });

        it('should clone roles from existing user', async () => {
            req.body = {
                username: 'newuser',
                password: 'Password123',
                cloneFromUserId: 'existinguser'
            };

            const mockExistingUser = {
                username: 'existinguser',
                roles: ['agent:status:read', 'agent:command:execute']
            };

            agentUserDetails.findOne = jest.fn()
                .mockResolvedValueOnce(mockExistingUser) // First call for clone
                .mockResolvedValueOnce(null); // Second call for existence check

            bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
            agentUserDetails.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue({ username: 'newuser' })
            }));

            await addUser(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.CREATED);
        });

        it('should handle hashing errors', async () => {
            req.body = {
                username: 'newuser',
                password: 'Password123'
            };

            agentUserDetails.findOne = jest.fn().mockResolvedValue(null);
            bcrypt.hash = jest.fn().mockRejectedValue(new Error('Hashing failed'));

            await addUser(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
        });
    });

    describe('deleteUserDetails', () => {
        it('should delete user successfully', async () => {
            req.query = { username: 'testuser' };

            agentUserDetails.findOne = jest.fn().mockResolvedValue({
                username: 'testuser'
            });
            agentUserDetails.deleteOne = jest.fn().mockResolvedValue({
                deletedCount: 1
            });

            await deleteUserDetails(req, res);

            expect(agentUserDetails.deleteOne).toHaveBeenCalledWith({
                username: 'testuser'
            });
            expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    flag: 'success'
                })
            );
        });

        it('should return error when username is missing', async () => {
            req.query = {};

            await deleteUserDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.ERROR);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Username is required'
                })
            );
        });

        it('should return 404 when user not found', async () => {
            req.query = { username: 'nonexistent' };

            agentUserDetails.findOne = jest.fn().mockResolvedValue(null);

            await deleteUserDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.NOT_FOUND);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'User not found'
                })
            );
        });

        it('should handle database errors', async () => {
            req.query = { username: 'testuser' };

            agentUserDetails.findOne = jest.fn().mockResolvedValue({ username: 'testuser' });
            agentUserDetails.deleteOne = jest.fn().mockRejectedValue(new Error('Database error'));

            await deleteUserDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
        });
    });

    describe('addPermission', () => {
        it('should create new permission successfully', async () => {
            req.body = {
                project: 'agent',
                module: 'status',
                permission: 'read',
                description: 'Read agent status'
            };

            Permission.findOne = jest.fn().mockResolvedValue(null);
            Permission.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue({
                    code: 'agent:status:read',
                    project: 'agent',
                    module: 'status',
                    permission: 'read'
                })
            }));

            await addPermission(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.CREATED);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    flag: 'success'
                })
            );
        });

        it('should return error when required fields are missing', async () => {
            req.body = { project: 'agent' }; // Missing module and permission

            await addPermission(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.ERROR);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.stringContaining('required')
                })
            );
        });

        it('should return error when permission code already exists', async () => {
            req.body = {
                project: 'agent',
                module: 'status',
                permission: 'read'
            };

            Permission.findOne = jest.fn().mockResolvedValue({
                code: 'agent:status:read'
            });

            await addPermission(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.EXISTS);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.stringContaining('already exists')
                })
            );
        });

        it('should trim whitespace from fields', async () => {
            req.body = {
                project: '  agent  ',
                module: '  status  ',
                permission: '  read  ',
                description: '  Test description  '
            };

            Permission.findOne = jest.fn().mockResolvedValue(null);
            const mockSave = jest.fn().mockResolvedValue({});
            Permission.mockImplementation(() => ({ save: mockSave }));

            await addPermission(req, res);

            expect(Permission).toHaveBeenCalledWith(
                expect.objectContaining({
                    project: 'agent',
                    module: 'status',
                    permission: 'read',
                    description: 'Test description'
                })
            );
        });
    });

    describe('getPermissions', () => {
        it('should return all permissions', async () => {
            const mockPermissions = [
                { _id: '1', code: 'agent:status:read', project: 'agent', module: 'status', permission: 'read' },
                { _id: '2', code: 'agent:command:execute', project: 'agent', module: 'command', permission: 'execute' }
            ];

            Permission.searchWithPagination = jest.fn().mockResolvedValue({
                permissions: mockPermissions,
                pagination: { page: 1, limit: 20, total: 2, pages: 1 }
            });

            await getPermissions(req, res);

            expect(Permission.searchWithPagination).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    flag: 'success'
                })
            );
        });

        it('should handle errors gracefully', async () => {
            Permission.searchWithPagination = jest.fn().mockRejectedValue(new Error('Database error'));

            await getPermissions(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
        });
    });

    describe('updatePermission', () => {
        it('should remove permissions from user', async () => {
            req.body = {
                username: 'testuser',
                roles: ['agent:status:read', 'agent:command:execute']
            };

            agentUserDetails.updateOne = jest.fn().mockResolvedValue({
                modifiedCount: 1
            });

            await updatePermission(req, res);

            expect(agentUserDetails.updateOne).toHaveBeenCalledWith(
                { username: 'testuser' },
                { $pull: { roles: { $in: ['agent:status:read', 'agent:command:execute'] } } }
            );
            expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
        });

        it('should handle no modifications', async () => {
            req.body = {
                username: 'testuser',
                roles: ['agent:status:read']
            };

            agentUserDetails.updateOne = jest.fn().mockResolvedValue({
                modifiedCount: 0
            });

            await updatePermission(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.NOT_FOUND);
        });

        it('should handle database errors', async () => {
            req.body = {
                username: 'testuser',
                roles: ['agent:status:read']
            };

            agentUserDetails.updateOne = jest.fn().mockRejectedValue(new Error('Database error'));

            await updatePermission(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
        });
    });

    describe('assignUserPermissions', () => {
        it('should assign permissions to user', async () => {
            req.params = { id: 'user-id' };
            req.body = {
                codes: ['agent:status:read', 'agent:command:execute']
            };

            Permission.validateCodes = jest.fn().mockResolvedValue({
                valid: true,
                invalidCodes: [],
                existingCodes: ['agent:status:read', 'agent:command:execute']
            });

            const mockSavedUser = {
                _id: 'user-id',
                roles: ['agent:status:read', 'agent:command:execute'],
                rolesCount: 2,
                updatedAt: new Date(),
                populate: jest.fn().mockResolvedValue({
                    updatedBy: { username: 'Admin' }
                })
            };

            const mockUser = {
                username: 'testuser',
                roles: [],
                save: jest.fn().mockResolvedValue(mockSavedUser)
            };

            agentUserDetails.findById = jest.fn().mockResolvedValue(mockUser);

            await assignUserPermissions(req, res);

            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
        });

        it('should return error when codes is not an array', async () => {
            req.params = { id: 'user-id' };
            req.body = { codes: 'not-an-array' };

            await assignUserPermissions(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.ERROR);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.stringContaining('array')
                })
            );
        });

        it('should return 404 when user not found', async () => {
            req.params = { id: 'nonexistent-id' };
            req.body = {
                codes: ['agent:status:read']
            };

            agentUserDetails.findById = jest.fn().mockResolvedValue(null);

            await assignUserPermissions(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.NOT_FOUND);
        });

        it('should handle database errors', async () => {
            req.params = { id: 'user-id' };
            req.body = {
                codes: ['agent:status:read']
            };

            agentUserDetails.findById = jest.fn().mockRejectedValue(new Error('Database error'));

            await assignUserPermissions(req, res);

            expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
        });
    });
});

