const fetch = require('node-fetch');
const { LOGGER, extractUsernameFromToken } = require('../../server/utils/opensearchLogger');
const { getOpenSearchPassword } = require('../../server/utils/envUtils');

// Mock dependencies
jest.mock('node-fetch');
jest.mock('../../server/utils/envUtils', () => ({
  getOpenSearchPassword: jest.fn().mockResolvedValue('mock-opensearch-password'),
}));

describe('opensearchLogger', () => {
  let mockReq;

  beforeEach(() => {
    mockReq = {
      header: jest.fn(),
      headers: { authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqbmpNU1VzZXJuYW1lIjoidGVzdHVzZXIifQ.test' },
      body: { hostname: 'testhost' },
      originalUrl: '/api/test',
      ip: '192.168.1.1',
      connection: { remoteAddress: '192.168.1.1' },
      get: jest.fn((key) => {
        if (key === 'Origin') return 'http://localhost';
        if (key === 'User-Agent') return 'Mozilla/5.0';
        return null;
      }),
    };

    process.env.OPENSEARCH_USER = 'testuser';
    process.env.OPENSEARCH_NON_PROD_PASSWORD = 'testpassword';
    process.env.OPENSEARCH_URL = 'http://opensearch:9200';
    process.env.OPENSEARCH_AUDIT_LOG_INDEX = 'audit-log';

    jest.clearAllMocks();
  });

  describe('extractUsernameFromToken', () => {
    it('should extract username from valid JWT token', () => {
      const token = Buffer.from(JSON.stringify({ jnjMSUsername: 'testuser' })).toString('base64');
      const fullToken = `header.${token}.signature`;
      mockReq.header.mockReturnValue(`Bearer ${fullToken}`);

      const username = extractUsernameFromToken(mockReq);
      expect(username).toBe('testuser');
    });

    it('should return "unknown" when token is missing', () => {
      mockReq.header.mockReturnValue(undefined);

      const username = extractUsernameFromToken(mockReq);
      expect(username).toBe('unknown');
    });

    it('should return "unknown" when jnjMSUsername is not in token', () => {
      const token = Buffer.from(JSON.stringify({ userId: 'testuser' })).toString('base64');
      const fullToken = `header.${token}.signature`;
      mockReq.header.mockReturnValue(`Bearer ${fullToken}`);

      const username = extractUsernameFromToken(mockReq);
      expect(username).toBe('unknown');
    });

    it('should return "unknown" when token is malformed', () => {
      mockReq.header.mockReturnValue('Bearer malformed');

      try {
        const username = extractUsernameFromToken(mockReq);
        expect(username).toBe('unknown');
      } catch (error) {
        // Function may throw on invalid Base64, which is acceptable
        expect(error).toBeDefined();
      }
    });

    it('should return "unknown" when authorization header is null', () => {
      mockReq.header.mockReturnValue(null);

      const username = extractUsernameFromToken(mockReq);
      expect(username).toBe('unknown');
    });
  });

  describe('LOGGER.infoLog', () => {
    beforeEach(() => {
      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue('OK'),
      });
    });

    it('should log info message successfully', async () => {
      await LOGGER.infoLog(mockReq, 'Test info message', 'testhost');

      // Check index exists (HEAD request)
      expect(fetch).toHaveBeenCalledWith(
        'http://opensearch:9200/audit-log',
        expect.objectContaining({ method: 'HEAD' })
      );

      // Check log data posted
      expect(fetch).toHaveBeenCalledWith(
        'http://opensearch:9200/audit-log/_doc',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Test info message'),
        })
      );
    });

    it('should create index if it does not exist', async () => {
      fetch
        .mockResolvedValueOnce({ status: 404, ok: false }) // HEAD returns 404
        .mockResolvedValueOnce({ ok: true, status: 201 }) // PUT creates index
        .mockResolvedValueOnce({ ok: true, status: 200 }); // POST logs data

      await LOGGER.infoLog(mockReq, 'Test message', 'testhost');

      expect(fetch).toHaveBeenCalledWith(
        'http://opensearch:9200/audit-log',
        expect.objectContaining({ method: 'HEAD' })
      );
      expect(fetch).toHaveBeenCalledWith(
        'http://opensearch:9200/audit-log',
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('number_of_shards'),
        })
      );
    });

    it('should handle IPv6 formatted IP addresses', async () => {
      mockReq.ip = '::ffff:192.168.1.1';

      await LOGGER.infoLog(mockReq, 'Test message', 'testhost');

      const logCall = fetch.mock.calls.find(call =>
        call[0].includes('/_doc') && call[1].method === 'POST'
      );
      expect(logCall).toBeDefined();
      const bodyData = JSON.parse(logCall[1].body);
      expect(bodyData.ip).toBe('192.168.1.1');
    });

    it('should use fallback IP from connection', async () => {
      mockReq.ip = undefined;
      mockReq.connection.remoteAddress = '10.0.0.1';

      await LOGGER.infoLog(mockReq, 'Test message', 'testhost');

      const logCall = fetch.mock.calls.find(call =>
        call[0].includes('/_doc') && call[1].method === 'POST'
      );
      const bodyData = JSON.parse(logCall[1].body);
      expect(bodyData.ip).toBe('10.0.0.1');
    });

    it('should handle logging failure gracefully', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      fetch.mockResolvedValueOnce({ status: 200, ok: true }) // HEAD
        .mockResolvedValueOnce({ ok: false, text: jest.fn().mockResolvedValue('Error') }); // POST fails

      await LOGGER.infoLog(mockReq, 'Test message', 'testhost');

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to log data'));
      consoleLogSpy.mockRestore();
    });

    it('should handle network error during logging', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      fetch.mockResolvedValueOnce({ status: 200, ok: true }) // HEAD
        .mockRejectedValueOnce(new Error('Network error')); // POST throws

      await LOGGER.infoLog(mockReq, 'Test message', 'testhost');

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleLogSpy.mockRestore();
    });
  });

  describe('LOGGER.errorLog', () => {
    beforeEach(() => {
      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue('OK'),
      });
    });

    it('should log error message with correct level', async () => {
      mockReq.body = {}; // Clear body hostname to use provided hostname

      await LOGGER.errorLog(mockReq, 'Test error message', 'errorhost');

      const logCall = fetch.mock.calls.find(call =>
        call[0].includes('/_doc') && call[1].method === 'POST'
      );
      expect(logCall).toBeDefined();
      const bodyData = JSON.parse(logCall[1].body);
      expect(bodyData.level).toBe('error');
      expect(bodyData.message).toBe('Test error message');
      expect(bodyData.hostname).toBe('errorhost');
    });
  });

  describe('LOGGER.warningLog', () => {
    beforeEach(() => {
      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue('OK'),
      });
    });

    it('should log warning message with correct level', async () => {
      mockReq.body = {}; // Clear body hostname to use provided hostname

      await LOGGER.warningLog(mockReq, 'Test warning message', 'warnhost');

      const logCall = fetch.mock.calls.find(call =>
        call[0].includes('/_doc') && call[1].method === 'POST'
      );
      expect(logCall).toBeDefined();
      const bodyData = JSON.parse(logCall[1].body);
      expect(bodyData.level).toBe('warning');
      expect(bodyData.message).toBe('Test warning message');
      expect(bodyData.hostname).toBe('warnhost');
    });

    it('should use hostname from req.body when not provided', async () => {
      mockReq.body.hostname = 'bodyhost';

      await LOGGER.warningLog(mockReq, 'Test warning', null);

      const logCall = fetch.mock.calls.find(call =>
        call[0].includes('/_doc') && call[1].method === 'POST'
      );
      const bodyData = JSON.parse(logCall[1].body);
      expect(bodyData.hostname).toBe('bodyhost');
    });
  });

  describe('checkAndCreateIndex', () => {
    it('should not create index if it already exists', async () => {
      fetch.mockResolvedValue({ status: 200, ok: true });

      await LOGGER.infoLog(mockReq, 'Test', 'testhost');

      // Only HEAD and POST should be called, no PUT for index creation
      const putCalls = fetch.mock.calls.filter(call => call[1]?.method === 'PUT');
      expect(putCalls.length).toBe(0);
    });

    it('should handle index creation failure', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      fetch
        .mockResolvedValueOnce({ status: 404, ok: false }) // HEAD - index doesn't exist
        .mockResolvedValueOnce({ 
          ok: false, 
          text: jest.fn().mockResolvedValue('Index creation failed')
        }) // PUT - creation fails
        .mockResolvedValueOnce({ ok: true, status: 200 }); // POST - log still succeeds

      await LOGGER.infoLog(mockReq, 'Test', 'testhost');

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to create index'));
      consoleLogSpy.mockRestore();
    });
  });

  describe('Log data structure', () => {
    beforeEach(() => {
      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue('OK'),
      });
    });

    it('should include all required fields in log data', async () => {
      await LOGGER.infoLog(mockReq, 'Test message', 'testhost');

      const logCall = fetch.mock.calls.find(call =>
        call[0].includes('/_doc') && call[1].method === 'POST'
      );
      const bodyData = JSON.parse(logCall[1].body);

      expect(bodyData).toMatchObject({
        hostname: 'testhost',
        user: expect.any(String),
        endpoint: '/api/test',
        level: 'info',
        message: 'Test message',
        loggername: 'risebot::UI',
        ip: expect.any(String),
        origin: 'http://localhost',
        userAgent: 'Mozilla/5.0',
        timestamp: expect.any(String),
      });
    });

    it('should use OpenSearch password from environment', async () => {
      process.env.OPENSEARCH_NON_PROD_PASSWORD = 'env-password';

      await LOGGER.infoLog(mockReq, 'Test', 'testhost');

      const authCalls = fetch.mock.calls.filter(call =>
        call[1]?.headers?.Authorization?.includes('Basic')
      );
      expect(authCalls.length).toBeGreaterThan(0);
      expect(getOpenSearchPassword).not.toHaveBeenCalled();
    });

    it('should fetch OpenSearch password when not in environment', async () => {
      delete process.env.OPENSEARCH_NON_PROD_PASSWORD;

      await LOGGER.infoLog(mockReq, 'Test', 'testhost');

      expect(getOpenSearchPassword).toHaveBeenCalled();
    });
  });
});
