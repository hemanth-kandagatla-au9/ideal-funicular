const express = require("express");
const router = express.Router();
const versionManagementController = require("../../controllers/version-management-controller/versionManagement.controller");

router.post("/", versionManagementController.createVersion);
router.get("/", versionManagementController.fetchVersions);
router.patch("/:id/delete", versionManagementController.deleteVersion);
router.patch("/:id", versionManagementController.updateVersion);

module.exports = router;