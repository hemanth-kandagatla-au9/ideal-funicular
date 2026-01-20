// ✅ Mock node-fetch properly
jest.mock('node-fetch', () => {
  return jest.fn(() => Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('')
  }));
});

const fetch = require('node-fetch');
const { LOGGER, extractUsernameFromToken } = require('../../server/utils/opensearchLogger'); // Update path as needed

beforeEach(() => {
  fetch.mockReset();
  process.env.OPENSEARCH_USER = 'testuser';
  process.env.OPENSEARCH_NON_PROD_PASSWORD = 'testpass';
  process.env.OPENSEARCH_URL = 'http://localhost:9200';
  process.env.OPENSEARCH_AUDIT_LOG_INDEX = 'audit-log';
});

describe('logger', () => {
  it('should return username from token', () => {
    const req = {
      header: jest.fn().mockReturnValue(
        'Bearer ' +
          [
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', // header (doesn't matter)
            Buffer.from(JSON.stringify({ jnjMSUsername: 'john.doe' })).toString('base64'),
            'signature',
          ].join('.')
      ),
    };
    const username = extractUsernameFromToken(req);
    expect(username).toBe('john.doe');
  });

  it('should return unknown if token is missing', () => {
    const req = { header: jest.fn().mockReturnValue(undefined) };
    expect(extractUsernameFromToken(req)).toBe('unknown');
  });

  it('should return unknown if username is missing in token', () => {
    const req = {
      header: jest.fn().mockReturnValue(
        'Bearer ' +
          [
            'header',
            Buffer.from(JSON.stringify({ notUser: 'n/a' })).toString('base64'),
            'sig',
          ].join('.')
      ),
    };
    expect(extractUsernameFromToken(req)).toBe('unknown');
  });
});

describe('LOGGER methods', () => {
  const mockRequest = {
    header: jest.fn(),
    get: jest.fn((field) => {
      return field === 'Origin' ? 'https://example.com' : 'Mozilla/5.0';
    }),
    body: {},
    originalUrl: '/api/test',
    ip: '::ffff:127.0.0.1',
    connection: { remoteAddress: '::1' },
  };

  it('should call infoLog without throwing', async () => {
    fetch
      .mockResolvedValueOnce({ status: 404, ok: false }) // HEAD
      .mockResolvedValueOnce({ ok: true }) // PUT
      .mockResolvedValueOnce({ ok: true }); // POST

    await expect(LOGGER.infoLog(mockRequest, 'This is an info log')).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledTimes(3);
  });

});
