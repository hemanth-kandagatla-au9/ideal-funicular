const responseHandler = require('../../server/utils/responseHandler');

describe('responseHandler', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('Validation', () => {
    it('should throw error when res is not provided', () => {
      expect(() => {
        responseHandler(null, false, 'Test message');
      }).toThrow('No arguments supplied');
    });

    it('should throw error when message is not provided', () => {
      expect(() => {
        responseHandler(mockRes, false, null);
      }).toThrow('No arguments supplied');
    });

    it('should throw error when message is empty string', () => {
      expect(() => {
        responseHandler(mockRes, false, '');
      }).toThrow('No arguments supplied');
    });
  });

  describe('Error responses', () => {
    it('should return error response with default status 200', () => {
      const error = new Error('Test error');
      const message = 'Operation failed';

      responseHandler(mockRes, error, message);

      expect(mockRes.status).toHaveBeenCalledWith('200');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: false,
        statusCode: '200',
        message,
        data: null,
        error,
      });
    });

    it('should return error response with custom status', () => {
      const error = new Error('Not found');
      const message = 'Resource not found';
      const status = '404';

      responseHandler(mockRes, error, message, null, status);

      expect(mockRes.status).toHaveBeenCalledWith('404');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: false,
        statusCode: '404',
        message,
        data: null,
        error,
      });
    });

    it('should return error response with data', () => {
      const error = new Error('Validation failed');
      const message = 'Invalid input';
      const data = { field: 'email' };
      const status = '400';

      responseHandler(mockRes, error, message, data, status);

      expect(mockRes.status).toHaveBeenCalledWith('400');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: false,
        statusCode: '400',
        message,
        data,
        error,
      });
    });

    it('should return error response with custom response fields', () => {
      const error = new Error('Server error');
      const message = 'Internal error';
      const customResponse = { errorCode: 'ERR_500', timestamp: Date.now() };

      responseHandler(mockRes, error, message, null, '500', customResponse);

      expect(mockRes.status).toHaveBeenCalledWith('500');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: false,
        statusCode: '500',
        message,
        data: null,
        error,
        errorCode: 'ERR_500',
        timestamp: expect.any(Number),
      });
    });
  });

  describe('Success responses', () => {
    it('should return success response with default status 200', () => {
      const message = 'Operation successful';

      responseHandler(mockRes, null, message);

      expect(mockRes.status).toHaveBeenCalledWith('200');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: true,
        statusCode: '200',
        message,
        data: null,
      });
    });

    it('should return success response with data', () => {
      const message = 'User created';
      const data = { id: 1, name: 'John Doe' };
      const status = '201';

      responseHandler(mockRes, null, message, data, status);

      expect(mockRes.status).toHaveBeenCalledWith('201');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: true,
        statusCode: '201',
        message,
        data,
      });
    });

    it('should return success response with array data', () => {
      const message = 'Users fetched';
      const data = [{ id: 1 }, { id: 2 }];

      responseHandler(mockRes, null, message, data);

      expect(mockRes.status).toHaveBeenCalledWith('200');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: true,
        statusCode: '200',
        message,
        data,
      });
    });

    it('should return success response with custom response fields', () => {
      const message = 'Data fetched';
      const data = { items: [] };
      const customResponse = { pagination: { page: 1, total: 0 } };

      responseHandler(mockRes, null, message, data, '200', customResponse);

      expect(mockRes.status).toHaveBeenCalledWith('200');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: true,
        statusCode: '200',
        message,
        data,
        pagination: { page: 1, total: 0 },
      });
    });

    it('should handle false error value (explicit no error)', () => {
      const message = 'Success';
      const data = { success: true };

      responseHandler(mockRes, false, message, data);

      expect(mockRes.status).toHaveBeenCalledWith('200');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: true,
        statusCode: '200',
        message,
        data,
      });
    });

    it('should handle undefined error value', () => {
      const message = 'Success';

      responseHandler(mockRes, undefined, message);

      expect(mockRes.status).toHaveBeenCalledWith('200');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: true,
        statusCode: '200',
        message,
        data: null,
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty customResponse object', () => {
      const message = 'Test';

      responseHandler(mockRes, null, message, null, '200', {});

      expect(mockRes.json).toHaveBeenCalledWith({
        status: true,
        statusCode: '200',
        message,
        data: null,
      });
    });

    it('should handle numeric status code', () => {
      const message = 'Success';

      responseHandler(mockRes, null, message, null, 200);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: true,
        statusCode: 200,
        message,
        data: null,
      });
    });

    it('should handle customResponse overriding fields', () => {
      const message = 'Test';
      const customResponse = { status: 'custom', message: 'overridden' };

      responseHandler(mockRes, null, message, null, '200', customResponse);

      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'custom',
        statusCode: '200',
        message: 'overridden',
        data: null,
      });
    });
  });
});
