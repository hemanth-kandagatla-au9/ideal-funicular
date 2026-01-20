const { putShutDown, putRestartAgent, updateVersion } = require("../services/agentService");
const { executeCommandOnAgent } = require("../utils/agentUtils");
const responseCodes = require("../utils/responseCodes");

const scheduleBulkAction = async (selectedAgents, actionFunction) => {
    for (const agent of selectedAgents) {
        setImmediate(() => {
            actionFunction(agent);
        });
    }
};

const bulkStartAgent = async (req, res) => {
    try {
        res.status(responseCodes.SUCCESS).json({ flag: 'success', message: "Bulk Agent Started" });

        for (const agent of req.body) {
            setImmediate(() => {
                executeCommandOnAgent(req, agent.hostname, agent.osVersion, res, true);
            });
        }
    }
    catch (error) {
        res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: error.message });
    }
};

const bulkStopAgent = async (req, res) => {
    try {
        scheduleBulkAction(req.body, putShutDown);
        res.status(responseCodes.SUCCESS).json({ flag: 'success', message: "Bulk Agent Stopped" });
    }
    catch (error) {
        res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: error.message });
    }
};

const bulkRestartAgent = async (req, res) => {
    try {
        scheduleBulkAction(req.body, putRestartAgent);
        res.status(responseCodes.SUCCESS).json({ flag: 'success', message: "Bulk Agent ReStarted" });
    }
    catch (error) {
        res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: error.message });
    }
};

const bulkUpgradeAgent = async (req, res) => {
    res.status(responseCodes.SUCCESS).json({ flag: 'success', message: "Bulk Agent Upgraded" });

    let versionData = { version: req.query.risebotAgentVersion }
    for (var agent of req.body) {
        (function (currentAgent) {
            setImmediate(() => {
                updateVersion({ ...currentAgent, ...versionData });
            });
        })(agent);
    }
};

const validateAgent = async (req, res) => {
  try {
    res.status(responseCodes.SUCCESS).json({ isCompatible: true });
  }
  catch (error) {
    res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: error.message });
  }
};

module.exports = {
    bulkStartAgent,
    bulkStopAgent,
    bulkRestartAgent,
    bulkUpgradeAgent,
    validateAgent,
};