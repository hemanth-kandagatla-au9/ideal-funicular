const express = require("express");
const agentServiceController = require("../../controllers/agentServiceController");
const bulkAgentController = require("../../controllers/bulkAgentController");
const agentVersionController = require("../../controllers/agentVersionController");
const downloadController = require("../../controllers/downloadController");
const router = express.Router();

router.get("/", agentServiceController.getAgentsData);
router.post("/", agentServiceController.getAgentsData);
router.post("/info", agentServiceController.getAgentInfo);
router.get("/getAgents", agentServiceController.getAgentsData);
router.post("/status", agentServiceController.health);
router.post("/download", agentServiceController.download);
router.post("/validate", bulkAgentController.validateAgent);
router.post("/versions", agentVersionController.manageVersions);
router.put("/versions", agentVersionController.manageVersions);
router.delete("/versions", agentVersionController.deleteVersion);
router.post("/download/scripts", downloadController.downloadScript);
router.post("/download/file", downloadController.downloadBinaryFile);
router.get("/download/file/:path/:file", downloadController.downloadRustFile)

module.exports = router;