const express = require("express");
const router = express.Router();
const applicationController = require("../../controllers/ui-monitoring-controller/applicationController")
const infrastructureController = require("../../controllers/ui-monitoring-controller/infrastructureController")
const logsController = require("../../controllers/ui-monitoring-controller/logsController")
const metricsController = require("../../controllers/ui-monitoring-controller/metricsController")
const networkController = require("../../controllers/ui-monitoring-controller/networkController")
const securityAlertController = require("../../controllers/ui-monitoring-controller/securityAlertController")

// Bulk operation routes
router.get("/application", applicationController.fetchApplicationPerformanceData);
router.get("/infrastructure", infrastructureController.fetchInfrastructureMonitoringData);
router.get("/logs", logsController.fetchLogsData);
router.get("/metrics", metricsController.fetchCardData);
router.get("/network", networkController.fetchNetworkMonitoringData);
router.get("/securityAlert", securityAlertController.fetchAlertsData);

module.exports = router;