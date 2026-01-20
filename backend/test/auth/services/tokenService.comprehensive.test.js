const jwt = require('jsonwebtoken');
const { generateToken, validateToken, validateSSMKeys } = require('../../../server/auth/services/tokenService');
const agentUserDataModel = require('../../../server/models/agentUserDetails');
const tokenLogs = require('../../../server/models/tokenLogs');
const fs = require('fs');
const path = require('path');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));
jest.mock('../../../server/models/agentUserDetails');
jest.mock('../../../server/models/tokenLogs');
jest.mock('fs');
jest.mock('path');

// Mock ssmAuthUtils
jest.mock('../../../server/utils/ssmAuthUtils', () => ({
    getCachedPrivateKey: jest.fn(),
    getCachedCertificate: jest.fn(),
    getPrivateKeyFromSSM: jest.fn(),
    getCertificateFromSSM: jest.fn()
}));

const ssmAuthUtils = require('../../../server/utils/ssmAuthUtils');
const bcrypt = require('bcrypt');

// Mock authConfig
jest.mock('../../../server/auth/utils/authConfig', () => ({
    getJWTConfig: jest.fn(() => ({
        algorithm: 'RS256',
        expiresIn: 3600
    }))
}));

describe('TokenService - Comprehensive Tests', () => {
    const mockPrivateKey = '-----BEGIN RSA PRIVATE KEY-----\nMOCK_PRIVATE_KEY\n-----END RSA PRIVATE KEY-----';
    const mockPublicKey = '-----BEGIN CERTIFICATE-----\nMOCK_CERTIFICATE\n-----END CERTIFICATE-----';
    const mockToken = 'mock.jwt.token';

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Default mock for path.join
        path.join.mockImplementation((...args) => args.join('/'));
        
        // Default environment variables
        process.env.JWT_PRIVATE_KEY = 'private-key.pem';
        process.env.JWT_PUBLIC_KEY = 'public-key.pem';

        // Default tokenLogs mock
        tokenLogs.create = jest.fn().mockResolvedValue({});
        tokenLogs.findOneAndUpdate = jest.fn().mockResolvedValue({});
        tokenLogs.findOne = jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(null)
        });
        tokenLogs.updateOne = jest.fn().mockResolvedValue({});
    });

    describe('generateToken', () => {
        it('should generate token successfully with file system keys', async () => {
            const username = 'testuser';
            const password = 'TestPass123!';
            const hashedPassword = '$2b$10$mockhashedpassword';
            
            // Mock file system
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue(mockPrivateKey);
            
            // Mock user data
            const mockUser = {
                username,
                password: hashedPassword,
                isActive: true,
                roles: ['agent:status:read', 'agent:command:execute']
            };
            
            agentUserDataModel.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(mockToken);
            
            const result = await generateToken(username, password);
            
            expect(result).toEqual({
                token: mockToken,
                tokenType: 'Bearer',
                expiresIn: 3600
            });
            expect(agentUserDataModel.findOne).toHaveBeenCalledWith({ username });
            expect(bcrypt.compare).toHaveBeenCalled();
            expect(jwt.sign).toHaveBeenCalled();
            expect(tokenLogs.create).toHaveBeenCalled();
        });

        it('should fetch private key from SSM when file does not exist', async () => {
            const username = 'testuser';
            const password = 'TestPass123!';
            const hashedPassword = '$2b$10$mockhashedpassword';
            
            // Mock file system - first call returns false, subsequent return true
            let existsCallCount = 0;
            fs.existsSync.mockImplementation(() => {
                existsCallCount++;
                return existsCallCount > 1;
            });
            
            fs.readFileSync.mockReturnValue(mockPrivateKey);
            fs.writeFileSync.mockImplementation(() => {});
            
            ssmAuthUtils.getPrivateKeyFromSSM.mockResolvedValue(mockPrivateKey);
            
            const mockUser = {
                username,
                password: hashedPassword,
                isActive: true,
                roles: ['agent:status:read']
            };
            
            agentUserDataModel.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(mockToken);
            
            const result = await generateToken(username, password);
            
            expect(ssmAuthUtils.getPrivateKeyFromSSM).toHaveBeenCalled();
            expect(fs.writeFileSync).toHaveBeenCalled();
            expect(result).toEqual(expect.objectContaining({
                token: mockToken,
                tokenType: 'Bearer'
            }));
        });

        it('should return empty array when user not found', async () => {
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue(mockPrivateKey);
            
            agentUserDataModel.findOne.mockResolvedValue(null);
            
            const result = await generateToken('nonexistent', 'password');
            
            expect(result).toEqual([]);
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('should throw error when user is inactive', async () => {
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue(mockPrivateKey);
            
            const mockUser = {
                username: 'testuser',
                password: '$2b$10$mockhashedpassword',
                isActive: false,
                roles: []
            };
            
            agentUserDataModel.findOne.mockResolvedValue(mockUser);
            
            await expect(generateToken('testuser', 'password')).rejects.toThrow('User is inactive or not found');
        });

        it('should return empty array when password does not match', async () => {
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue(mockPrivateKey);
            
            const mockUser = {
                username: 'testuser',
                password: '$2b$10$mockhashedpassword',
                isActive: true,
                roles: ['agent:status:read']
            };
            
            agentUserDataModel.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
            
            const result = await generateToken('testuser', 'wrongpass');
            
            expect(result).toEqual([]);
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('should handle user with no roles', async () => {
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue(mockPrivateKey);
            
            const mockUser = {
                username: 'testuser',
                password: '$2b$10$mockhashedpassword',
                isActive: true,
                roles: []
            };
            
            agentUserDataModel.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(mockToken);
            
            const result = await generateToken('testuser', 'password');
            
            expect(jwt.sign).toHaveBeenCalledWith(
                expect.objectContaining({
                    roles: []
                }),
                mockPrivateKey,
                expect.any(Object)
            );
        });

        it('should handle SSM fetch errors', async () => {
            fs.existsSync.mockReturnValue(false);
            ssmAuthUtils.getPrivateKeyFromSSM.mockRejectedValue(new Error('SSM fetch failed'));
            
            await expect(generateToken('testuser', 'password')).rejects.toThrow();
        });
    });

    describe('validateToken', () => {
        it('should validate token successfully with file system certificate', async () => {
            const decodedPayload = {
                sub: 'testuser',
                roles: ['agent:status:read']
            };
            
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue(mockPublicKey);
            
            jwt.verify.mockReturnValue(decodedPayload);
            
            const result = await validateToken(mockToken);
            
            expect(result).toEqual({
                valid: true,
                payload: decodedPayload
            });
            expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockPublicKey, expect.any(Object));
            expect(tokenLogs.findOneAndUpdate).toHaveBeenCalled();
        });

        it('should fetch certificate from SSM when file does not exist', async () => {
            const decodedPayload = {
                sub: 'testuser',
                roles: ['agent:status:read']
            };
            
            // Mock file system - first call returns false
            let existsCallCount = 0;
            fs.existsSync.mockImplementation(() => {
                existsCallCount++;
                return existsCallCount > 1;
            });
            
            fs.readFileSync.mockReturnValue(mockPublicKey);
            fs.writeFileSync.mockImplementation(() => {});
            
            ssmAuthUtils.getCertificateFromSSM.mockResolvedValue(mockPublicKey);
            jwt.verify.mockReturnValue(decodedPayload);
            
            const result = await validateToken(mockToken);
            
            expect(ssmAuthUtils.getCertificateFromSSM).toHaveBeenCalled();
            expect(fs.writeFileSync).toHaveBeenCalled();
            expect(result).toEqual({
                valid: true,
                payload: decodedPayload
            });
        });

        it('should return validation error for missing token', async () => {
            const result = await validateToken('');
            
            expect(result).toEqual({
                valid: false,
                reason: 'Token is required'
            });
        });

        it('should handle invalid token with user tracking', async () => {
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue(mockPublicKey);
            
            const decodedPayload = { sub: 'testuser' };
            jwt.verify.mockImplementation(() => {
                const error = new Error('invalid token');
                error.name = 'JsonWebTokenError';
                throw error;
            });
            jwt.decode.mockReturnValue(decodedPayload);
            
            const mockTokenLog = {
                _id: 'log123',
                username: 'testuser',
                wrongTokenCount: 1
            };
            
            tokenLogs.findOne.mockReturnValue({
                sort: jest.fn().mockResolvedValue(mockTokenLog)
            });
            
            const result = await validateToken(mockToken);
            
            expect(result).toEqual({
                valid: false,
                reason: 'Invalid token format or signature'
            });
            expect(tokenLogs.updateOne).toHaveBeenCalledWith(
                { _id: 'log123' },
                expect.objectContaining({
                    $set: expect.objectContaining({
                        action: 'FAILED',
                        wrongTokenCount: 2
                    })
                })
            );
        });

        it('should deactivate user after 3 wrong token attempts', async () => {
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue(mockPublicKey);
            
            const decodedPayload = { sub: 'testuser' };
            jwt.verify.mockImplementation(() => {
                const error = new Error('invalid token');
                error.name = 'JsonWebTokenError';
                throw error;
            });
            jwt.decode.mockReturnValue(decodedPayload);
            
            const mockTokenLog = {
                _id: 'log123',
                username: 'testuser',
                wrongTokenCount: 3
            };
            
            tokenLogs.findOne.mockReturnValue({
                sort: jest.fn().mockResolvedValue(mockTokenLog)
            });
            
            agentUserDataModel.findOneAndUpdate = jest.fn().mockResolvedValue({});
            
            const result = await validateToken(mockToken);
            
            expect(agentUserDataModel.findOneAndUpdate).toHaveBeenCalledWith(
                { username: 'testuser' },
                { isActive: false }
            );
        });

        it('should handle SSM certificate fetch errors', async () => {
            fs.existsSync.mockReturnValue(false);
            ssmAuthUtils.getCertificateFromSSM.mockRejectedValue(new Error('SSM fetch failed'));
            
            await expect(validateToken(mockToken)).rejects.toThrow();
        });
    });

    describe('validateSSMKeys', () => {
        it('should return true when both keys are accessible from files', async () => {
            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockImplementation((filePath) => {
                if (filePath.includes('private')) return mockPrivateKey;
                return mockPublicKey;
            });
            
            const result = await validateSSMKeys();
            
            expect(result).toBe(true);
        });

        it('should return true when keys are fetched from SSM', async () => {
            let existsCallCount = 0;
            fs.existsSync.mockImplementation(() => {
                existsCallCount++;
                // Return false for first 2 calls (private and public check), then true
                return existsCallCount > 2;
            });
            
            fs.writeFileSync.mockImplementation(() => {});
            fs.readFileSync.mockImplementation((filePath) => {
                if (filePath.includes('private')) return mockPrivateKey;
                return mockPublicKey;
            });
            
            ssmAuthUtils.getPrivateKeyFromSSM.mockResolvedValue(mockPrivateKey);
            ssmAuthUtils.getCertificateFromSSM.mockResolvedValue(mockPublicKey);
            
            const result = await validateSSMKeys();
            
            expect(result).toBe(true);
        });




    });

});
