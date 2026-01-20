const AgentMasterdataModel = require("../models/agentMasterdataModel");
const { buildQuery } = require("../utils/agentUtils");
const responseCodes = require("../utils/responseCodes");

const getMasterAgentsData = async (req, res) => {
    try {
        const reqbody = req.method === 'GET' ? req.query : req.body;
        const limit = parseInt(reqbody.limit) || 100;
        const pageNo = parseInt(reqbody.pageNo) || 1;
        const skip = (pageNo - 1) * limit;

        const query = buildQuery(reqbody);

        const resultSet = await AgentMasterdataModel.find(query).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalRows = await AgentMasterdataModel.countDocuments();
        const totalPage = Math.ceil(totalRows / limit);

        const result = {
            limit,
            pageNo,
            totalPage,
            totalCount: totalRows,
            totalData: resultSet

        };

        res.status(responseCodes.SUCCESS).json({ flag: "success", data: result });
    }
    catch (error) {
        res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: error.message });
    }
};

const insertMasterAgent = async (req, res) => {
    try {
        const hostnamesArray = req.body.hostnames.split(',');
        const recordsToInsert = hostnamesArray.map(hostname => ({ hostname, createdAt: new Date() }));

        const uniqueHostnames = new Set(hostnamesArray);

        const existingRecords = await AgentMasterdataModel.find({ hostname: { $in: [...uniqueHostnames] } });

        const uniqueRecordsToInsert = recordsToInsert.filter(record => {
            return !existingRecords.some(existingRecord => existingRecord.hostname === record.hostname);
        });

        if (uniqueRecordsToInsert.length > 0) {
            const result = await AgentMasterdataModel.insertMany(uniqueRecordsToInsert);
            res.status(responseCodes.SUCCESS).json({ flag: "success", data: `${result.insertedCount} records inserted successfully.` });

        } else {
            res.status(responseCodes.SUCCESS).json({ flag: "error", error: `Failed while adding hostname: Hostname ${hostnamesArray} already exists` });
        }
    }
    catch (error) {
        res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: error.message });
    }
};

const deleteMasterAgent = async (req, res) => {
    try {
        const hostname = req.query.hostname;
        const deleteResult = await AgentMasterdataModel.deleteOne({ hostname: hostname });
        res.status(responseCodes.SUCCESS).json({ flag: "success", data: `${deleteResult.deletedCount} records deleted successfully.` });
    }
    catch (error) {
        res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: error.message });
    }
};

module.exports = {
    getMasterAgentsData,
    insertMasterAgent,
    deleteMasterAgent
};