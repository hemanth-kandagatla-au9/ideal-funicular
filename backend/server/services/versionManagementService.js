const mongoose = require("mongoose");
const AgentVersionModel = require("../models/agentVersionModel");
const VersionsModel = require("../models/versionsModel");
const responseCodes = require("../utils/responseCodes");

const getVersions = async query => {
    try {
        const { operatingSystem, versionStatus, upgradeType,agentVersion, startDate, endDate, page = 1, limit = 10, isDeleted } = query;
        const matchStage = {};
        matchStage.isDeleted = isDeleted;
        if (operatingSystem !== undefined && operatingSystem !== "") {
            matchStage["compatibleOS.agentType"] = { $in: operatingSystem.split(",") };
        }
        if (versionStatus !== undefined && versionStatus !== "") {
            matchStage.versionStatus = { $in: versionStatus.split(",") };
        }
        if (upgradeType !== undefined && upgradeType !== "") {
            matchStage.upgradeType = { $in: upgradeType.split(",") };
        }
        if (agentVersion !== undefined && agentVersion !== "") {
            matchStage.agentVersion = { $in: agentVersion.split(",") };
        }
        if (startDate || endDate) {
            matchStage.releaseDate = {};
            if (startDate !== undefined && startDate !== "") matchStage.releaseDate.$gte = new Date(startDate);
            if (endDate !== undefined && endDate !== "") matchStage.releaseDate.$lte = new Date(endDate);
        }
        const pipeline = [];
        pipeline.push({ $match: matchStage });
        const skip = (parseInt(page) - 1) * parseInt(limit);
        // Fetch total count
        const countResult = await AgentVersionModel.aggregate([
            { $match: matchStage },
            { $count: "total" }
        ]);
        const total = countResult[0]?.total || 0;
        const aggregationResult = await AgentVersionModel.aggregate([
            { $match: matchStage },
            { $sort: { createdAt: 1 } },
            { $skip: skip },
            { $limit: parseInt(limit) }
        ]);
        const result = {
            versionData: aggregationResult,
            filterData: await extractFilterOptions(matchStage),
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        }
        return result;
    }
    catch (err) {
        console.log(`error getting versions => ${err}`);
        return err;
    }
}

async function extractFilterOptions(matchStage) {
    const pipeline = [
        { $match: matchStage },
        { $unwind: "$compatibleOS" },
        {
            $group: {
                _id: null,
                operatingSystem: { $addToSet: "$compatibleOS.agentType" },
                versionStatus: { $addToSet: "$versionStatus" },
                upgradeType: { $addToSet: "$upgradeType" }
            }
        },
        
        {
            $project: {
                _id: 0,
                operatingSystem: { $sortArray: { input: "$operatingSystem", sortBy: 1 } },
                versionStatus: { $sortArray: { input: "$versionStatus", sortBy: 1 } },
                upgradeType: { $sortArray: { input: "$upgradeType", sortBy: 1 } }
            }
        }
    ];

    const result = await AgentVersionModel.aggregate(pipeline);
    return result[0] || { operatingSystem: [], versionStatus: [], upgradeType: [] };
}

const saveVersion = async (versionData) => {
    try {
        const { agentVersion } = versionData;
        const query = { agentVersion, isDeleted: false };
        const versionExists = await AgentVersionModel.find(query);
        if (versionExists.length) {
            return responseCodes.EXISTS;
        }
        else {
            const agentVersion = new AgentVersionModel({ ...versionData });
            const savedAgentVersion = await agentVersion.save();
            console.log("savedAgentVersion => ", savedAgentVersion);
            return savedAgentVersion;
        }
    }
    catch (err) {
        console.log("error creating binary version ", err);
        return err;
    }
}

const softDeleteVersion = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return "Invalid ObjectId";
        }

        const result = await AgentVersionModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        console.log("result => ", result);
        if (!result) {
            return "Version not found";
        }

        return {
            message: "Version soft-deleted successfully",
            data: result
        };

    } catch (err) {
        console.error("Error soft deleting version:", err);
        return err;
    }
};

const updateVersionService = async (id, updateData) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return "Invalid ObjectId";
        }

        const result = await AgentVersionModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updateData },
            { new: true }
        );

        if (!result) {
            return "Version not found";
        }

        return {
            message: "Version data updated successfully",
            data: result
        };

    } catch (err) {
        console.error("Error updating version data", err);
        return err;
    }
};

/**
 * Centralized Version Sync Logic
 * Used by both cron jobs and manual sync API
 * Synchronizes version data between collections
 */
const syncVersions = async () => {
    try {
        console.log("Starting version synchronization job...");
        
        const startTime = new Date();
        console.log(`Version sync started at: ${startTime.toISOString()}`);
        
        // Fetch all versions from the versions collection
        const versions = await VersionsModel.find({});
        console.log(`Found ${versions.length} versions in versions collection`);
        
        let syncedCount = 0;
        let updatedCount = 0;
        let errorCount = 0;
        
        // Process each version
        for (const versionData of versions) {
            try {
                if (!versionData.version) {
                    console.warn(`Skipping version with missing version field:`, versionData);
                    continue;
                }
                
                // Ensure buildDate is a proper Date object
                const buildDate = versionData.buildDate ? new Date(versionData.buildDate) : new Date();
                
                // Check if version already exists in agent_versions
                const existingVersion = await AgentVersionModel.findOne({ 
                    agentVersion: versionData.version,
                    isDeleted: false 
                });
                
                if (existingVersion) {
                    // Convert existing buildDate to Date object for comparison
                    const existingBuildDate = existingVersion.buildDate ? new Date(existingVersion.buildDate) : null;
                    const newBuildDate = new Date(buildDate);
                    
                    // Update existing version's buildDate if different or missing
                    if (!existingBuildDate || existingBuildDate.getTime() !== newBuildDate.getTime()) {
                        await AgentVersionModel.findByIdAndUpdate(
                            existingVersion._id,
                            { 
                                buildDate: newBuildDate,
                                updatedAt: new Date()
                            }
                        );
                        
                        updatedCount++;
                        console.log(`Updated buildDate for existing version: ${versionData.version} from ${existingBuildDate} to ${newBuildDate}`);
                    } else {
                        console.log(`Version ${versionData.version} buildDate unchanged: ${existingBuildDate}`);
                    }
                } else {
                    // Create new agent version record
                    const newAgentVersion = {
                        agentVersion: versionData.version,
                        buildDate: new Date(buildDate),
                        compatibleOS: [],
                        releaseDate: new Date(),
                        versionStatus: "Current",
                        upgradeType: "Optional",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        isDeleted: false
                    };
                    
                    await AgentVersionModel.create(newAgentVersion);
                    syncedCount++;
                    console.log(`Created new version: ${versionData.version} with buildDate: ${buildDate}`);
                }
                
            } catch (syncError) {
                errorCount++;
                console.error(`Error syncing version ${versionData.version}:`, syncError.message);
            }
        }
        
        const endTime = new Date();
        const duration = endTime - startTime;
        
        console.log(`Version sync completed at: ${endTime.toISOString()}`);
        console.log(`Duration: ${duration}ms`);
        console.log(`Results: ${syncedCount} new records created, ${updatedCount} existing records updated, ${errorCount} errors`);
        
        return {
            success: true,
            syncedCount,
            updatedCount,
            errorCount,
            duration: duration
        };
        
    } catch (error) {
        console.error("Error in version synchronization:", error);
        console.error("Stack trace:", error.stack);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { saveVersion, getVersions, softDeleteVersion, updateVersionService, syncVersions };