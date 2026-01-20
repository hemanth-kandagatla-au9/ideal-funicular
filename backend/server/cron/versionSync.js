require("dotenv").config();

const { syncVersions } = require("../services/versionManagementService");

/**
 * Version Sync Cron Job
 * Uses centralized sync logic from versionManagementService
 */
const versionSync = async () => {
    console.log("Cron job: Starting version synchronization...");
    return await syncVersions();
};

const syncVersionData = () => {
    console.log("Version sync cron job triggered");
    versionSync();
};

module.exports = {
    syncVersionData,
    versionSync
};