const AgentModel = require("../models/agentModel");
const AgentVersionModel = require("../models/agentVersionModel");
const { updateVersion } = require("../services/agentService");
const { handleApiResponse } = require("../utils/agentUtils");
const responseCodes = require("../utils/responseCodes");

const manageVersions = async (req, res) => {
    const versions = req.body;
    const method = req.method;

    if (!Array.isArray(versions)) {
        return res.status(responseCodes.ERROR).json({ flag: "error", message: "Invalid input format. Expected an array of version documents." });
    }

    try {
        if (method === 'POST') {
            const insertResults = await Promise.all(versions.map(async (version) => {
                const existingRecord = await AgentVersionModel.findOne({ agentVersion: version.agentVersion });
                if (existingRecord) {
                    return { success: false, version: version.agentVersion };
                } else {
                    await AgentVersionModel.insertOne(version);
                    return { success: true, version: version.agentVersion };
                }
            }));

            const successCount = insertResults.filter(result => result.success).length;
            const errorCount = insertResults.length - successCount;

            res.status(responseCodes.SUCCESS).json({
                flag: errorCount > 0 ? "partial_success" : "success",
                data: `${successCount} records inserted successfully, ${errorCount} records failed.`
            });

        } else if (method === 'PUT') {
            const updateResults = await Promise.all(versions.map(async (version) => {
                const result = await AgentVersionModel.updateOne(
                    { agentVersion: version.agentVersion },
                    { $set: version },
                    { upsert: true }
                );
                return { success: result.modifiedCount > 0 || result.upsertedCount > 0, version: version.agentVersion };
            }));

            const successCount = updateResults.filter(result => result.success).length;
            const errorCount = updateResults.length - successCount;

            res.status(responseCodes.SUCCESS).json({
                flag: errorCount > 0 ? "partial_success" : "success",
                data: `${successCount} records updated successfully, ${errorCount} records failed.`
            });

        } else {
            res.status(responseCodes.ERROR).json({ flag: "error", message: "Invalid HTTP method." });
        }
    } catch (error) {
        console.error('Error handling versions:', error);
        res.status(responseCodes.SERVER_ERROR).json({ flag: "error", message: 'Error occurred ' });
    }
};

const deleteVersion = async (req, res) => {
    const agentVersion = req.query.agentVersion;

    if (!agentVersion) {
        return res.status(responseCodes.ERROR).json({ flag: "error", message: "agentVersion required." });
    }

    try {
        const deleteResult = await AgentVersionModel.deleteOne({ agentVersion });
        res.status(responseCodes.SUCCESS).json({ flag: "success", data: `${deleteResult.deletedCount} record deleted.` });
    } catch (error) {
        console.error('Error:', error);
        res.status(responseCodes.SERVER_ERROR).json({ flag: "error", message: 'Deletion error.' });
    }
};

const getVersionsList = async (req, res) => {
    try {
        // Only retrieve agentVersion, buildDate (as releaseDate), compatibleOS, and upgradeType
        let filter = { isDeleted: false };
        const versions = await AgentVersionModel.find(filter)
            .select('_id agentVersion buildDate compatibleOS upgradeType releaseDate')
            .sort({ createdAt: -1 })
            .lean();
        // Transform data to match expected frontend format
        const risebotVersions = versions.map(version => ({
            id: version._id,
            agentVersion: version.agentVersion,
            version: version.agentVersion,
            buildDate: version.buildDate ? version.buildDate.toString() : null,
            compatibleOS: version.compatibleOS || [],
            upgradeType: version.upgradeType || null
        }));

        res.status(responseCodes.SUCCESS).json({
             flag: "success",
            data: {
                risebotVersions
            }
        });
    } catch (error) {
        console.error('Error fetching versions list:', error);
        res.status(responseCodes.SERVER_ERROR).json({
            flag: "error",
            message: "Failed to fetch versions",
            error: error.message
        });
    }
};

const getAgentVersions = async (req, res) => {
    try {
        const values = await AgentModel.distinct(`agent_details.version`);
        const responseObject = { flag: 'success' };
        responseObject['agentVersions'] = { ['versions']: values };
        res.status(responseCodes.SUCCESS).json(responseObject);
    } catch (error) {
        res.status(responseCodes.SERVER_ERROR).json({ flag: 'error', message: 'Internal server error', error: error });
    }
};

module.exports = {
    manageVersions,
    deleteVersion,
    getVersionsList,
    getAgentVersions,
    version: (req, res) => handleApiResponse(req, res, updateVersion),
};