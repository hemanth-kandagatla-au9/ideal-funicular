const { 
  downloadScript, 
  downloadBinaryFile, 
  downloadRustFile 
} = require('../../server/controllers/downloadController');
const { getFileFromS3 } = require('../../server/services/awsConnection');
const responseCodes = require('../../server/utils/responseCodes');
const { Readable } = require('stream');

jest.mock('../../server/services/awsConnection');

describe('Download Controller', () => {
  let mockReq;
  let mockRes;
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {},
      params: {},
    };

    mockRes = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('downloadScript', () => {
    it('should download file successfully', async () => {
      const mockStream = new Readable();
      mockStream.push('file content');
      mockStream.push(null);
      mockStream.pipe = jest.fn((res) => {
        return { on: jest.fn().mockReturnValue(res) };
      });

      getFileFromS3.mockResolvedValue(mockStream);

      await downloadScript(mockReq, mockRes, 'path/to/test-file.sh');

      expect(getFileFromS3).toHaveBeenCalledWith('path/to/test-file.sh');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/octet-stream');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename="test-file.sh"');
      expect(mockStream.pipe).toHaveBeenCalledWith(mockRes);
    });

    it('should handle stream errors', async () => {
      const mockStream = new Readable();
      const streamError = new Error('Stream interrupted');
      mockStream.pipe = jest.fn(() => ({
        on: jest.fn((event, callback) => {
          if (event === 'error') {
            callback(streamError);
          }
          return mockRes;
        }),
      }));

      getFileFromS3.mockResolvedValue(mockStream);

      await downloadScript(mockReq, mockRes, 'path/to/file.sh');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Stream Error:', streamError);
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: 'Stream interrupted',
        message: 'server error',
      });
    });

    it('should handle when file is not found', async () => {
      getFileFromS3.mockResolvedValue(null);

      await downloadScript(mockReq, mockRes, 'path/to/missing.sh');

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        message: 'No file',
      });
    });

    it('should handle S3 errors', async () => {
      const error = new Error('S3 access denied');
      getFileFromS3.mockRejectedValue(error);

      await downloadScript(mockReq, mockRes, 'path/to/file.sh');

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: 'S3 access denied',
        message: 'server error',
      });
    });
  });

  describe('downloadBinaryFile', () => {
    it('should download binary file successfully', async () => {
      mockReq.body.path = 'binaries/installer.exe';
      
      const mockStream = new Readable();
      mockStream.pipe = jest.fn((res) => ({
        on: jest.fn().mockReturnValue(res),
      }));

      getFileFromS3.mockResolvedValue(mockStream);

      await downloadBinaryFile(mockReq, mockRes);

      expect(getFileFromS3).toHaveBeenCalledWith('binaries/installer.exe');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/octet-stream');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename="installer.exe"');
    });

    it('should handle stream errors during binary download', async () => {
      mockReq.body.path = 'binaries/app.exe';
      
      const mockStream = new Readable();
      const streamError = new Error('Connection lost');
      mockStream.pipe = jest.fn(() => ({
        on: jest.fn((event, callback) => {
          if (event === 'error') {
            callback(streamError);
          }
          return mockRes;
        }),
      }));

      getFileFromS3.mockResolvedValue(mockStream);

      await downloadBinaryFile(mockReq, mockRes);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Stream Error:', streamError);
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
    });

    it('should handle missing binary file', async () => {
      mockReq.body.path = 'binaries/notfound.exe';
      getFileFromS3.mockResolvedValue(null);

      await downloadBinaryFile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        message: 'No file',
      });
    });

    it('should handle errors during binary file download', async () => {
      mockReq.body.path = 'binaries/file.exe';
      const error = new Error('Download failed');
      getFileFromS3.mockRejectedValue(error);

      await downloadBinaryFile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: 'Download failed',
        message: 'server error',
      });
    });
  });

  describe('downloadRustFile', () => {
    it('should download rust file successfully', async () => {
      mockReq.params.path = 'rust/agent';
      mockReq.params.file = 'agent-binary';
      
      const mockStream = new Readable();
      mockStream.pipe = jest.fn((res) => ({
        on: jest.fn().mockReturnValue(res),
      }));

      getFileFromS3.mockResolvedValue(mockStream);

      await downloadRustFile(mockReq, mockRes);

      expect(getFileFromS3).toHaveBeenCalledWith('rust/agent/agent-binary');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/octet-stream');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename="rust/agent/agent-binary"');
    });

    it('should handle stream errors during rust file download', async () => {
      mockReq.params.path = 'rust/tools';
      mockReq.params.file = 'tool.bin';
      
      const mockStream = new Readable();
      const streamError = new Error('Pipe broken');
      mockStream.pipe = jest.fn(() => ({
        on: jest.fn((event, callback) => {
          if (event === 'error') {
            callback(streamError);
          }
          return mockRes;
        }),
      }));

      getFileFromS3.mockResolvedValue(mockStream);

      await downloadRustFile(mockReq, mockRes);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Stream Error:', streamError);
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
    });

    it('should handle missing rust file', async () => {
      mockReq.params.path = 'rust/missing';
      mockReq.params.file = 'notfound';
      getFileFromS3.mockResolvedValue(null);

      await downloadRustFile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        message: 'No file',
      });
    });

    it('should handle errors during rust file download', async () => {
      mockReq.params.path = 'rust/project';
      mockReq.params.file = 'binary';
      const error = new Error('S3 error');
      getFileFromS3.mockRejectedValue(error);

      await downloadRustFile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: 'S3 error',
        message: 'server error',
      });
    });
  });
});
