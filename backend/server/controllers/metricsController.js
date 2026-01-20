const AgentModel = require("../models/agentModel");
const responseCodes = require("../utils/responseCodes");

const getMetricsData = async (req, res) => {
    try {
        const resultSet = await AgentModel.find();
        const activeCount = resultSet.filter(agent => agent.status === 'Active').length;
        const inactiveCount = resultSet.filter(agent => agent.status === 'Inactive').length;
        const failedCount = resultSet.filter(agent => agent.status === 'Failed').length;
        let result = [
            {
                "name": "Active",
                "count": activeCount
            },
            {
                "name": "Inactive",
                "count": inactiveCount
            },
            {
                "name": "Failed",
                "count": failedCount
            }
        ];
        res.status(responseCodes.SUCCESS).json({ flag: "success", data: result });
    }
    catch (error) {
        res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: error.message });
    }
};

module.exports = {
    getMetricsData
};