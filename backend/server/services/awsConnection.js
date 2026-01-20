const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getAWSKey, getAWSSecreet } = require("../utils/envUtils");

const createAWSClient = async () => {
  const awsAccessKey = process.env.AWS_ACCESS_KEY_ID
    ? process.env.AWS_ACCESS_KEY_ID
    : await getAWSKey();
  const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY
    ? process.env.AWS_SECRET_ACCESS_KEY
    : await getAWSSecreet();
  const awsS3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretKey,
    },
  });
  return awsS3Client;
};

const getFileFromS3 = async (fileName = "") => {
  try {
    const getObjectParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    };

    const command = new GetObjectCommand(getObjectParams);

    const awsS3Client = await createAWSClient();
    const response = await awsS3Client.send(command);
    return response.Body;
  } catch (e) {
    console.log("Error downloading from S3 bucket", e);
    return null;
  }
};

const uploadFileToS3 = async (uploadParams) => {
  try {
    // Upload the file to S3
    const command = new PutObjectCommand(uploadParams);
    const awsS3Client = await createAWSClient();
    await awsS3Client.send(command);

    console.log("File uploaded successfully to S3");

    // Return success response with the file URL
    return {
      flag: "success",
      message: {upload: "File uploaded successfully"}
      //   fileUrl: `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`, // S3 file URL
    };
  } catch (error) {
    console.error("Error updating file on S3:", error);
    return {
      flag: "error",
      err: error,
      message: "Failed to update the file on S3",
    };
  }
};

module.exports = {
  getFileFromS3,
  uploadFileToS3,
};