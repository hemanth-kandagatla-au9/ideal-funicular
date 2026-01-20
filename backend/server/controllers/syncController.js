const cronJobController = require("../cron/agentInfo");
const responseCodes = require("../utils/responseCodes");
const { to } = require('await-to-js');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/messages');
const { versionSync } = require('../cron/versionSync');

const syncAgentStatus = async (req, res) => {
    try {
        cronJobController.syncAgentStatus();
        cronJobController.syncDiscoveryData();
        res.status(responseCodes.SUCCESS).json({ flag: 'success', message: "Agent Status Synced" });
    }
    catch (error) {
        res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: error.message });
    }
};

const syncCMDBData = async (req, res) => {
    try {
        cronJobController.syncDiscoveryData();
        res.status(responseCodes.SUCCESS).json({ flag: 'success', message: "Agent CMDB Synced" });
    }
    catch (error) {
        res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: error.message });
    }
};

const manualVersionSync = async (req, res) => {
    let [err, result] = await to(versionSync());
    
    if (err) {
        console.error('Manual version sync error:', err);
        return responseHandler(res, err.stack, messages.SERVER_ERROR, [], responseCodes.SERVER_ERROR);
    }

    return responseHandler(res,null, messages.SUCCESS, result, responseCodes.OK);
};

module.exports = {
    syncAgentStatus,
    syncCMDBData,
    manualVersionSync
};