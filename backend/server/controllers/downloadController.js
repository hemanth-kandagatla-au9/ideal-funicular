const { getFileFromS3 } = require("../services/awsConnection");
const responseCodes = require("../utils/responseCodes");

const downloadScript = async (req, res, fileKey) => {

  try {
    const binaryRes = await getFileFromS3(fileKey);

    if (binaryRes) {
      const fileName = fileKey.split("/").pop();
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      binaryRes.pipe(res).on("error", (error) => {
        console.error("Stream Error:", error);
        res.status(responseCodes.SERVER_ERROR).json({
          flag: "error",
          error: error.message,
          message: "server error",
        });
      });
    } else {
      res.status(responseCodes.SUCCESS).json({
        flag: "error",
        message: "No file"
      });
    }

  } catch (error) {
    res.status(responseCodes.SERVER_ERROR).json({
      flag: "error",
      error: error.message,
      message: "server error",
    });
  }
};

const downloadBinaryFile = async (req, res) => {
  const fileKey = req.body.path;
  try {
    const binaryRes = await getFileFromS3(fileKey);

    if (binaryRes) {
      const fileName = fileKey.split("/").pop();
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      binaryRes.pipe(res).on("error", (error) => {
        console.error("Stream Error:", error);
        res.status(responseCodes.SERVER_ERROR).json({
          flag: "error",
          error: error.message,
          message: "server error",
        });
      });
    } else {
      res.status(responseCodes.SUCCESS).json({
        flag: "error",
        message: "No file"
      });
    }

  } catch (error) {
    res.status(responseCodes.SERVER_ERROR).json({
      flag: "error",
      error: error.message,
      message: "server error",
    });
  }
};

const downloadRustFile = async (req, res) => {
  try {
    const { path } = req.params;
    const { file } = req.params;
    const fileName = `${path}/${file}`;
    const binaryRes = await getFileFromS3(fileName);

    if (binaryRes) {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      binaryRes.pipe(res).on("error", (error) => {
        console.error("Stream Error:", error);
        res.status(responseCodes.SERVER_ERROR).json({
          flag: "error",
          error: error.message,
          message: "server error",
        });
      });
    } else {
      res.status(responseCodes.SUCCESS).json({
        flag: "error",
        message: "No file"
      });
    }

  } catch (error) {
    res.status(responseCodes.SERVER_ERROR).json({
      flag: "error",
      error: error.message,
      message: "server error",
    });
  }
};

module.exports = {
  downloadScript,
  downloadBinaryFile,
  downloadRustFile
};