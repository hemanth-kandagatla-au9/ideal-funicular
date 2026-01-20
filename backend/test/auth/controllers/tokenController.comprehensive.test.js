const { generateTokenEndpoint, validateTokenEndpoint, healthCheck } = require('../../../server/auth/controllers/tokenController');
const { generateToken, validateToken, validateSSMKeys } = require('../../../server/auth/services/tokenService');
const responseCodes = require('../../../server/utils/responseCodes');
const responseHandler = require('../../../server/utils/responseHandler');

// Mock dependencies
jest.mock('../../../server/auth/services/tokenService');
jest.mock('../../../server/utils/responseHandler');

describe('TokenController - Comprehensive Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            headers: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
        responseHandler.mockImplementation((res, error, message, data, statusCode) => {
            res.status(statusCode).json({ error, message, data });
        });
        jest.clearAllMocks();
    });

    describe('generateTokenEndpoint', () => {
        describe('Success Cases', () => {
            it('should generate token with valid Basic Auth credentials', async () => {
                const mockUsername = 'testuser';
                const mockPassword = 'password123';
                const mockTokenData = {
                    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.test.token',
                    expiresIn: '24h'
                };

                const credentials = Buffer.from(`${mockUsername}:${mockPassword}`).toString('base64');
                req.headers['authorization'] = `Basic ${credentials}`;

                generateToken.mockResolvedValue(mockTokenData);

                await generateTokenEndpoint(req, res);

                expect(generateToken).toHaveBeenCalledWith(mockUsername, mockPassword);
                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    null,
                    'Token Generation Success',
                    mockTokenData,
                    responseCodes.SUCCESS
                );
            });

            it('should handle successful token generation with complex usernames', async () => {
                const mockUsername = 'user@company.com';
                const mockPassword = 'complex$Pass123';
                const mockTokenData = { token: 'valid.jwt.token' };

                const credentials = Buffer.from(`${mockUsername}:${mockPassword}`).toString('base64');
                req.headers['authorization'] = `Basic ${credentials}`;

                generateToken.mockResolvedValue(mockTokenData);

                await generateTokenEndpoint(req, res);

                expect(generateToken).toHaveBeenCalledWith(mockUsername, mockPassword);
            });
        });

        describe('Validation Errors', () => {
            it('should return 401 when Authorization header is missing', async () => {
                await generateTokenEndpoint(req, res);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Missing or invalid Authorization header'
                });
            });

            it('should return 401 when Authorization header does not start with Basic', async () => {
                req.headers['authorization'] = 'Bearer sometoken';

                await generateTokenEndpoint(req, res);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Missing or invalid Authorization header'
                });
            });

            it('should return 404 when credentials are invalid', async () => {
                const credentials = Buffer.from('user:wrongpass').toString('base64');
                req.headers['authorization'] = `Basic ${credentials}`;

                generateToken.mockResolvedValue([]);

                await generateTokenEndpoint(req, res);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    null,
                    'Username or password is not valid',
                    [],
                    responseCodes.NOT_FOUND
                );
            });
        });

        describe('Error Handling', () => {
            it('should handle service errors', async () => {
                const credentials = Buffer.from('user:pass').toString('base64');
                req.headers['authorization'] = `Basic ${credentials}`;

                const error = new Error('Token generation service unavailable');
                generateToken.mockRejectedValue(error);

                await generateTokenEndpoint(req, res);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    'Token generation service unavailable',
                    'Internal Server Error',
                    [],
                    responseCodes.SERVER_ERROR
                );
            });

            it('should handle errors without message', async () => {
                const credentials = Buffer.from('user:pass').toString('base64');
                req.headers['authorization'] = `Basic ${credentials}`;

                generateToken.mockRejectedValue(new Error());

                await generateTokenEndpoint(req, res);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    'Token generation failed',
                    'Internal Server Error',
                    [],
                    responseCodes.SERVER_ERROR
                );
            });
        });
    });

    describe('validateTokenEndpoint', () => {
        describe('Success Cases', () => {
            it('should validate a valid Bearer token', async () => {
                const mockToken = 'valid.jwt.token';
                const mockPayload = {
                    username: 'testuser',
                    email: 'test@example.com',
                    roles: ['admin']
                };

                req.headers['authorization'] = `Bearer ${mockToken}`;

                validateToken.mockResolvedValue({
                    valid: true,
                    payload: mockPayload
                });

                await validateTokenEndpoint(req, res);

                expect(validateToken).toHaveBeenCalledWith(mockToken);
                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    null,
                    'Token is valid',
                    expect.objectContaining({
                        valid: true,
                        payload: mockPayload,
                        tokenLength: mockToken.length
                    }),
                    responseCodes.SUCCESS
                );
            });

            it('should include timestamp in validation response', async () => {
                const mockToken = 'valid.jwt.token';
                req.headers['authorization'] = `Bearer ${mockToken}`;

                validateToken.mockResolvedValue({
                    valid: true,
                    payload: { username: 'test' }
                });

                await validateTokenEndpoint(req, res);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    null,
                    'Token is valid',
                    expect.objectContaining({
                        validationTimestamp: expect.any(String)
                    }),
                    responseCodes.SUCCESS
                );
            });
        });

        describe('Missing Token Cases', () => {
            it('should return error when Authorization header is missing', async () => {
                await validateTokenEndpoint(req, res);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    'Authentication Token is required',
                    'Missing Authorization Header',
                    [],
                    responseCodes.BAD_REQUEST
                );
            });

            it('should return 401 when Bearer token is missing after space', async () => {
                req.headers['authorization'] = 'Bearer ';

                await validateTokenEndpoint(req, res);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Bearer token missing'
                });
            });

            it('should use UNAUTHORIZED code when next function is provided', async () => {
                const next = jest.fn();

                await validateTokenEndpoint(req, res, next);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    'Authentication Token is required',
                    'Missing Authorization Header',
                    [],
                    responseCodes.UNAUTHORIZED
                );
            });
        });

        describe('Invalid Token Cases', () => {
            it('should handle expired token', async () => {
                const mockToken = 'expired.jwt.token';
                req.headers['authorization'] = `Bearer ${mockToken}`;

                validateToken.mockResolvedValue({
                    valid: false,
                    error: 'Token expired'
                });

                await validateTokenEndpoint(req, res);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    'Invalid or expired token',
                    'Token Validation Failed',
                    expect.objectContaining({
                        valid: false,
                        tokenLength: mockToken.length
                    }),
                    responseCodes.UNAUTHORIZED
                );
            });

            it('should handle malformed token', async () => {
                const mockToken = 'malformed.token';
                req.headers['authorization'] = `Bearer ${mockToken}`;

                validateToken.mockResolvedValue({
                    valid: false,
                    error: 'jwt malformed'
                });

                await validateTokenEndpoint(req, res);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    'Invalid or expired token',
                    'Token Validation Failed',
                    expect.objectContaining({
                        valid: false,
                        error: 'jwt malformed'
                    }),
                    responseCodes.UNAUTHORIZED
                );
            });
        });

        describe('Error Handling', () => {
            it('should handle validation service errors', async () => {
                const mockToken = 'some.jwt.token';
                req.headers['authorization'] = `Bearer ${mockToken}`;

                const error = new Error('Validation service error');
                validateToken.mockRejectedValue(error);

                await validateTokenEndpoint(req, res);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    'Validation service error',
                    'Internal Server Error',
                    expect.objectContaining({
                        error: 'Token validation service error'
                    }),
                    responseCodes.SERVER_ERROR
                );
            });

            it('should handle errors without message', async () => {
                const mockToken = 'some.jwt.token';
                req.headers['authorization'] = `Bearer ${mockToken}`;

                validateToken.mockRejectedValue(new Error());

                await validateTokenEndpoint(req, res);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    'Token validation failed',
                    'Internal Server Error',
                    expect.any(Object),
                    responseCodes.SERVER_ERROR
                );
            });
        });
    });

    describe('healthCheck', () => {
        describe('Success Cases', () => {
            it('should return healthy status when SSM keys are accessible', async () => {
                validateSSMKeys.mockResolvedValue(true);

                await healthCheck(req, res);

                expect(validateSSMKeys).toHaveBeenCalled();
                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    'Authentication service is healthy',
                    'Service Health Check',
                    expect.objectContaining({
                        status: 'healthy',
                        ssmKeys: 'accessible',
                        service: 'risebot-auth-service'
                    }),
                    responseCodes.SUCCESS
                );
            });

            it('should include timestamp in health check response', async () => {
                validateSSMKeys.mockResolvedValue(true);

                await healthCheck(req, res);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    expect.any(String),
                    expect.any(String),
                    expect.objectContaining({
                        timestamp: expect.any(String)
                    }),
                    responseCodes.SUCCESS
                );
            });
        });

        describe('Warning Cases', () => {
            it('should return warning when SSM keys are not accessible', async () => {
                validateSSMKeys.mockResolvedValue(false);

                await healthCheck(req, res);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    'Authentication service is partially unavailable - SSM keys not accessible',
                    'Service Health Warning',
                    expect.objectContaining({
                        status: 'healthy',
                        ssmKeys: 'not accessible'
                    }),
                    responseCodes.SERVER_ERROR
                );
            });
        });

        describe('Error Handling', () => {
            it('should handle health check service errors', async () => {
                const error = new Error('SSM service unavailable');
                validateSSMKeys.mockRejectedValue(error);

                await healthCheck(req, res);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    'Authentication service health check failed',
                    'Service Health Error',
                    expect.objectContaining({
                        status: 'unhealthy',
                        error: 'SSM service unavailable'
                    }),
                    responseCodes.SERVER_ERROR
                );
            });

            it('should include timestamp in error response', async () => {
                validateSSMKeys.mockRejectedValue(new Error('Test error'));

                await healthCheck(req, res);

                expect(responseHandler).toHaveBeenCalledWith(
                    res,
                    expect.any(String),
                    expect.any(String),
                    expect.objectContaining({
                        timestamp: expect.any(String)
                    }),
                    responseCodes.SERVER_ERROR
                );
            });
        });
    });

    describe('Edge Cases and Security', () => {
        it('should handle malformed Basic Auth header', async () => {
            req.headers['authorization'] = 'Basic invalid_base64!!!';

            try {
                await generateTokenEndpoint(req, res);
            } catch (error) {
                // Should handle gracefully
            }

            expect(res.status).toHaveBeenCalled();
        });

        it('should handle Basic Auth without colon separator', async () => {
            const credentials = Buffer.from('usernameonly').toString('base64');
            req.headers['authorization'] = `Basic ${credentials}`;

            generateToken.mockResolvedValue({ token: 'test' });

            await generateTokenEndpoint(req, res);

            expect(generateToken).toHaveBeenCalled();
        });

        it('should handle very long tokens in validation', async () => {
            const longToken = 'a'.repeat(10000);
            req.headers['authorization'] = `Bearer ${longToken}`;

            validateToken.mockResolvedValue({ valid: true, payload: {} });

            await validateTokenEndpoint(req, res);

            expect(responseHandler).toHaveBeenCalledWith(
                res,
                null,
                'Token is valid',
                expect.objectContaining({
                    tokenLength: 10000
                }),
                responseCodes.SUCCESS
            );
        });

        it('should handle case-sensitive Bearer keyword', async () => {
            req.headers['authorization'] = 'bearer sometoken';

            validateToken.mockResolvedValue({ valid: true, payload: {} });

            await validateTokenEndpoint(req, res);

            expect(validateToken).toHaveBeenCalledWith('sometoken');
        });
    });
});
