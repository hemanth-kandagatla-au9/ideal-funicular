const express = require("express");
const router = express.Router();
const agentMasterController = require("../../controllers/agentMasterController");

// Master agent data
router.get("/masterdata", agentMasterController.getMasterAgentsData);
router.post("/masterdata", agentMasterController.insertMasterAgent);
router.delete("/masterdata", agentMasterController.deleteMasterAgent);

module.exports = router;