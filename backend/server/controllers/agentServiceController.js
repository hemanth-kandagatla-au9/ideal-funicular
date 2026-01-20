const responseCodes = require("../utils/responseCodes");
const AgentModel = require("../models/agentModel");
const { handleApiResponse, getDistinctValues, buildQuery,executeCommandOnAgent } = require('../utils/agentUtils');
const { getPid, getConfig, updateLocalConfiguration, getApplicationLogs, putRestartAgent, putShutDown, getHealth, downloadFile } = require('../services/agentService');

const startAgentService = async (req, res) => {
    executeCommandOnAgent(req, req.body.hostname, req.body.osVersion, res);
};

const getAgentInfo = async (req, res) => {
    let hostName = req.body.hostname;
    const result = await AgentModel.findOne({ hostname: hostName });
    const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);


    if (!result) {
        res.status(responseCodes.NOT_FOUND).json({ flag: "error", message: "Host Not found", data: {} });
    }
    else {

        result.agent_details.cpu_usage = typeof result.agent_details.cpu_usage !== 'string' ? `${parseFloat(result.agent_details.cpu_usage).toFixed(3)}%` : result.agent_details.cpu_usage;
        result.agent_details.memory = typeof result.agent_details.memory !== 'string' ? `${bytesToMB(result.agent_details.memory)} MB` : result.agent_details.memory;
        result.agent_details.disk_usage = typeof result.agent_details.disk_usage !== 'string' ? `${bytesToMB(result.agent_details.disk_usage)} MB` : result.agent_details.disk_usage;

        res.status(responseCodes.SUCCESS).json({ flag: "success", data: result });
    }

};

const getAgentsData = async (req, res) => {
    try {
        const reqbody = req.method === 'GET' ? req.query : req.body;
        const limit = parseInt(reqbody.pageSize) || 100;
        const pageNo = parseInt(reqbody.pageNo) || 0;
        const skip = (pageNo) * limit;
        const sortBy = reqbody.sortBy || 'createdAt'
        const sortingOrder = reqbody.sortOrder == 'asc'? 1 : -1
    

        const query = buildQuery(reqbody);
        const resultSet = await AgentModel.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortingOrder });

        const totalCount = await AgentModel.countDocuments(query);

        let activeCount = 0;
        let inactiveCount = 0;
        let failedCount = 0;

        const { status, ...filteredQuery } = query;
        activeCount = await AgentModel.countDocuments({ status: 'Active', ...filteredQuery });
        inactiveCount = await AgentModel.countDocuments({ status: 'Inactive', ...filteredQuery });
        failedCount = await AgentModel.countDocuments({ status: 'Failed', ...filteredQuery });


        const result = {
            pagination: {
                limit,
                pageNo,
                totalPage: totalCount,
                activeCount,
                failedCount,
                inactiveCount,
                allCount: activeCount + inactiveCount + failedCount,
                totalRows: resultSet,
                status: status,
            }
        };
        res.status(responseCodes.SUCCESS).json({ flag: "success", data: result });
    }
    catch (error) {
        res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: error.message });
    }
};

const checkBasicAuth  = async (req,res)=> {

    try{
    const hostName = req.query.hostname;
    const result = await AgentModel.findOne({ hostname: hostName });

    if (!result) {
        res.status(responseCodes.NOT_FOUND).json({ flag: "error", message: "Host Not found", data: {} });
    }

 const version = result.agent_details.version
 const isBasicAuth = parseFloat(version) < 3.0;

  const data = {
    hostName,
    version,
    isBasicAuth
  };
 res.status(responseCodes.SUCCESS).json({ flag: "success", data });
} catch(err){
     res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: err.message });
}

};


const getRegions = async (req, res) => {
    await getDistinctValues("slRegion", res, "regions", "agentRegions");
};

const getPlatforms = async (req, res) => {
    await getDistinctValues("slPlatform", res, "platforms", "agentPlatforms");
};

const getEnvironments = async (req, res) => {
    await getDistinctValues("ciSapNameEnv", res, "environments", "agentEnvironments");
};

const getSids = async (req, res) => {
    await getDistinctValues("ciSapNameSid", res, "sids", "agentSids");
};

const getOStypes = async (req, res) => {
    // await getDistinctValues("os", res, "os", "agentOsTypes");
     await getDistinctValues("ciOsType", res, "os", "agentOsTypes")
};

const getServiceNames = async (req, res) => {
    await getDistinctValues("slName", res, "serviceNames", "agentServiceNames");
};

// export controller functions
module.exports = {
    startAgentService,
    getAgentInfo,
    getAgentsData,
    getRegions,
    getPlatforms,
    getEnvironments,
    getSids,
    getOStypes,
    getServiceNames,
    checkBasicAuth,
    pid: (req, res) => handleApiResponse(req, res, getPid),
    config: (req, res) => handleApiResponse(req, res, getConfig),
    updateLocalConfiguration: (req, res) => handleApiResponse(req, res, updateLocalConfiguration),
    getApplicationLogs: (req, res) => handleApiResponse(req, res, getApplicationLogs),
    restartAgent: (req, res) => handleApiResponse(req, res, putRestartAgent),
    shutdown: (req, res) => handleApiResponse(req, res, putShutDown),
    health: (req, res) => handleApiResponse(req, res, getHealth),
    download: (req, res) => handleApiResponse(req, res, downloadFile), //not use
    // add other agent-related methods here
};