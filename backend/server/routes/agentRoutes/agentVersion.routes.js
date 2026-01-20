const express = require("express");
const router = express.Router();
const agentVersionController = require("../../controllers/agentVersionController");
const versionManagementController = require("../../controllers/version-management-controller/versionManagement.controller")

router.put("/download", agentVersionController.version);
router.get("/versionlist", agentVersionController.getVersionsList);
router.get("/agent-versions", agentVersionController.getAgentVersions);

router.put("/updateVersion/:id", versionManagementController.updateVersion);

module.exports = router;