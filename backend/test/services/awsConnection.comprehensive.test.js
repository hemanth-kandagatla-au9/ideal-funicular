const {
  getFileFromS3,
  uploadFileToS3
} = require('../../server/services/awsConnection');

const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

jest.mock("@aws-sdk/client-s3");
jest.mock("../../server/utils/envUtils", () => ({
  getAWSKey: jest.fn().mockResolvedValue('mock-access-key'),
  getAWSSecreet: jest.fn().mockResolvedValue('mock-secret-key')
}));

describe('awsConnection', () => {
  let mockSend;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockSend = jest.fn();
    S3Client.mockImplementation(() => ({
      send: mockSend
    }));

    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_BUCKET_NAME = 'test-bucket';
  });

  describe('getFileFromS3', () => {
    it('should retrieve file from S3 successfully', async () => {
      const mockBody = { data: 'file content' };
      mockSend.mockResolvedValue({ Body: mockBody });

      const result = await getFileFromS3('test-file.txt');

      expect(result).toEqual(mockBody);
      expect(mockSend).toHaveBeenCalled();
      expect(GetObjectCommand).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: 'test-file.txt'
      });
    });

    it('should return null on S3 error', async () => {
      mockSend.mockRejectedValue(new Error('S3 error'));
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await getFileFromS3('missing-file.txt');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error downloading from S3 bucket',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('uploadFileToS3', () => {
    it('should upload file to S3 successfully', async () => {
      mockSend.mockResolvedValue({});

      const uploadParams = {
        Bucket: 'test-bucket',
        Key: 'upload-file.txt',
        Body: 'file content'
      };

      const result = await uploadFileToS3(uploadParams);

      expect(result.flag).toBe('success');
      expect(result.message.upload).toBe('File uploaded successfully');
      expect(mockSend).toHaveBeenCalled();
      expect(PutObjectCommand).toHaveBeenCalledWith(uploadParams);
    });

    it('should handle upload errors', async () => {
      const error = new Error('Upload failed');
      mockSend.mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const uploadParams = {
        Bucket: 'test-bucket',
        Key: 'fail-file.txt',
        Body: 'content'
      };

      const result = await uploadFileToS3(uploadParams);

      expect(result.flag).toBe('error');
      expect(result.message).toBe('Failed to update the file on S3');
      expect(result.err).toBe(error);
      expect(consoleSpy).toHaveBeenCalledWith('Error updating file on S3:', error);

      consoleSpy.mockRestore();
    });

    it('should use environment AWS credentials', async () => {
      process.env.AWS_ACCESS_KEY_ID = 'env-key-id';
      process.env.AWS_SECRET_ACCESS_KEY = 'env-secret-key';
      
      mockSend.mockResolvedValue({});

      await getFileFromS3('test.txt');

      expect(S3Client).toHaveBeenCalledWith(expect.objectContaining({
        region: 'us-east-1',
        credentials: expect.objectContaining({
          accessKeyId: expect.any(String),
          secretAccessKey: expect.any(String)
        })
      }));
    });
  });
});
