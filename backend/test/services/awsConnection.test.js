const {
  getFileFromS3,
  uploadFileToS3,
} = require('../../server/services/awsConnection');

const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const envUtils = require('../../server/utils/envUtils');

jest.mock('@aws-sdk/client-s3');
jest.mock('../../server/utils/envUtils');

describe('AWS S3 Utilities', () => {
  let mockSend;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock environment variables
    process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
    process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_BUCKET_NAME = 'test-bucket';

    // Mock S3Client and its send method
    mockSend = jest.fn();
    S3Client.mockImplementation(() => ({
      send: mockSend,
    }));
  });

  describe('getFileFromS3', () => {
    it('should return file body on successful fetch', async () => {
      const mockBody = 'mock-file-content';
      mockSend.mockResolvedValue({ Body: mockBody });

      const result = await getFileFromS3('test-file.txt');

      expect(S3Client).toHaveBeenCalled();
      expect(GetObjectCommand).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: 'test-file.txt',
      });
      expect(result).toBe(mockBody);
    });

    it('should return null on error', async () => {
      mockSend.mockRejectedValue(new Error('S3 error'));

      const result = await getFileFromS3('error-file.txt');

      expect(result).toBeNull();
    });
  });

  describe('uploadFileToS3', () => {
    it('should return success flag on successful upload', async () => {
      mockSend.mockResolvedValue({});

      const uploadParams = {
        Bucket: 'test-bucket',
        Key: 'test-upload.txt',
        Body: 'content',
      };

      const result = await uploadFileToS3(uploadParams);

      expect(PutObjectCommand).toHaveBeenCalledWith(uploadParams);
      expect(result).toEqual({
        flag: 'success',
        message: { upload: 'File uploaded successfully' },
      });
    });

    it('should return error object on upload failure', async () => {
      const error = new Error('Upload failed');
      mockSend.mockRejectedValue(error);

      const uploadParams = {
        Bucket: 'test-bucket',
        Key: 'test-upload.txt',
        Body: 'content',
      };

      const result = await uploadFileToS3(uploadParams);

      expect(result.flag).toBe('error');
      expect(result.err).toBe(error);
      expect(result.message).toBe('Failed to update the file on S3');
    });
  });
});
