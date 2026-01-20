const express = require("express");
const router = express.Router();
const metricsController = require("../../controllers/metricsController");
const agentServiceController = require("../../controllers/agentServiceController");
const agentSyncController = require("../../controllers/syncController");

// Agent lifecycle and config routes
router.get("/", agentServiceController.getAgentsData);
router.post("/", agentServiceController.getAgentsData);
router.post("/info", agentServiceController.getAgentInfo);
router.get("/pid", agentServiceController.pid);
router.get("/metrics", metricsController.getMetricsData);
router.get("/config", agentServiceController.config);
router.put("/local-configuration", agentServiceController.updateLocalConfiguration);
router.post("/logs", agentServiceController.getApplicationLogs);
router.get("/regions", agentServiceController.getRegions);
router.get("/platforms", agentServiceController.getPlatforms);
router.get("/environments", agentServiceController.getEnvironments);
router.get("/sids", agentServiceController.getSids);
router.get("/os-types", agentServiceController.getOStypes);
router.get("/service-names", agentServiceController.getServiceNames);
router.get("/check-basic-auth",agentServiceController.checkBasicAuth);

// Agent API
router.post("/startagent", agentServiceController.startAgentService);
router.put("/restart", agentServiceController.restartAgent);
router.put("/shutdown", agentServiceController.shutdown);
router.post("/health", agentServiceController.health);

// Sync API
router.put("/syncAgentStatus", agentSyncController.syncAgentStatus);
router.put("/syncVersions", agentSyncController.manualVersionSync);
router.put("/syncCMDBData", agentSyncController.syncCMDBData);

module.exports = router;