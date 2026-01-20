const express = require("express");
const router = express.Router();
const bulkController = require("../../controllers/bulkAgentController")

// Bulk operation routes
router.post("/bulk/start", bulkController.bulkStartAgent);
router.post("/bulk/stop", bulkController.bulkStopAgent);
router.post("/bulk/restart", bulkController.bulkRestartAgent);
router.put("/bulk/upgrade", bulkController.bulkUpgradeAgent);

module.exports = router;