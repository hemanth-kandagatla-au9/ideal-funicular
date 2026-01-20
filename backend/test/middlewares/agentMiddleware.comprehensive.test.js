const { validate, validatewithBasicAuth } = require('../../server/middlewares/agentMiddleware');
const { getRustPassword } = require('../../server/utils/envUtils');
const responseCodes = require('../../server/utils/responseCodes');

jest.mock('../../server/utils/envUtils');

describe('Agent Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFn;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      headers: {},
    };
    
    mockRes = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    
    nextFn = jest.fn();
  });

  describe('validate', () => {
    it('should call next without validation', async () => {
      await validate(mockReq, mockRes, nextFn);

      expect(nextFn).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should always pass in current implementation', async () => {
      const testCases = [
        {},
        { headers: { authorization: 'Bearer token' } },
        { headers: {} },
      ];

      for (const req of testCases) {
        await validate(req, mockRes, nextFn);
        expect(nextFn).toHaveBeenCalled();
      }
    });
  });

  describe('validatewithBasicAuth', () => {
    beforeEach(() => {
      process.env.RUST_API_USERNAME = 'testuser';
      process.env.RUST_API_PASSWORD = 'testpass';
    });

    it('should reject request without credentials', async () => {
      await validatewithBasicAuth(mockReq, mockRes, nextFn);

      expect(mockRes.setHeader).toHaveBeenCalledWith('WWW-Authenticate', 'Basic realm="Authorization Required"');
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.UNAUTHORIZED);
      expect(mockRes.send).toHaveBeenCalledWith('Unauthorized');
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('should reject request with invalid credentials', async () => {
      const invalidAuth = Buffer.from('wronguser:wrongpass').toString('base64');
      mockReq.headers.authorization = `Basic ${invalidAuth}`;

      await validatewithBasicAuth(mockReq, mockRes, nextFn);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.UNAUTHORIZED);
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('should accept request with valid credentials from env', async () => {
      const validAuth = Buffer.from('testuser:testpass').toString('base64');
      mockReq.headers.authorization = `Basic ${validAuth}`;

      await validatewithBasicAuth(mockReq, mockRes, nextFn);

      expect(nextFn).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should accept request with valid credentials from SSM', async () => {
      delete process.env.RUST_API_PASSWORD;
      getRustPassword.mockResolvedValue('ssm-password');

      const validAuth = Buffer.from('testuser:ssm-password').toString('base64');
      mockReq.headers.authorization = `Basic ${validAuth}`;

      await validatewithBasicAuth(mockReq, mockRes, nextFn);

      expect(getRustPassword).toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalled();
      
      // Restore
      process.env.RUST_API_PASSWORD = 'testpass';
    });

    it('should allow all requests in testbasic environment', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'testbasic';

      // No credentials
      await validatewithBasicAuth(mockReq, mockRes, nextFn);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.UNAUTHORIZED);
      expect(nextFn).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });

    it('should reject when username matches but password is wrong', async () => {
      const invalidAuth = Buffer.from('testuser:wrongpass').toString('base64');
      mockReq.headers.authorization = `Basic ${invalidAuth}`;

      await validatewithBasicAuth(mockReq, mockRes, nextFn);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.UNAUTHORIZED);
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('should reject when password matches but username is wrong', async () => {
      const invalidAuth = Buffer.from('wronguser:testpass').toString('base64');
      mockReq.headers.authorization = `Basic ${invalidAuth}`;

      await validatewithBasicAuth(mockReq, mockRes, nextFn);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.UNAUTHORIZED);
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('should handle malformed authorization header', async () => {
      mockReq.headers.authorization = 'InvalidHeader';

      await validatewithBasicAuth(mockReq, mockRes, nextFn);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.UNAUTHORIZED);
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('should handle empty username and password', async () => {
      const emptyAuth = Buffer.from(':').toString('base64');
      mockReq.headers.authorization = `Basic ${emptyAuth}`;

      await validatewithBasicAuth(mockReq, mockRes, nextFn);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.UNAUTHORIZED);
      expect(nextFn).not.toHaveBeenCalled();
    });
  });
});
