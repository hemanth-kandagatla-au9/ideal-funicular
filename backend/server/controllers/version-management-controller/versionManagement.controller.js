const responseHandler = require("../../utils/responseHandler");
const responseCodes = require("../../utils/responseCodes");
const messages = require("../../utils/messages");
const { to } = require("await-to-js");
const { saveVersion, getVersions, softDeleteVersion, updateVersionService } = require("../../services/versionManagementService");

const createVersion = async (req, res) => {
    try {
        const { agentVersion } = req.body;
        let [createVersionErr, createdVersion] = await to(saveVersion(req.body));
        if (createVersionErr) {
            return responseHandler(
                res,
                createVersionErr.stack,
                messages.SERVER_ERROR,
                [],
                responseCodes.SERVER_ERROR
            )
        }
        if (!createVersion && !createdVersion) {
            return responseHandler(
                res,
                { error: true },
                messages.NOT_FOUND,
                [],
                responseCodes.NOT_FOUND
            )
        }
        if (createdVersion === responseCodes.EXISTS) {
            return responseHandler(
                res,
                true,
                messages.EXISTS,
                `Version ${agentVersion} already exists`,
                responseCodes.EXISTS
            )
        }
        return responseHandler(
            res,
            null,
            messages.SUCCESS,
            "Version created successfully",
            responseCodes.SUCCESS
        );
    }
    catch (err) {
        return responseHandler(
            res,
            err.stack,
            messages.SERVER_ERROR,
            [],
            responseCodes.SERVER_ERROR
        );
    }
}

const fetchVersions = async (req, res) => {
    try {
        // All dummy versions
        const allVersions = [
            { _id: "1", agentVersion: "0.1.1", os: "windows", upgradeType: "Mandatory", compatibleOS: ["windows"], buildDate: new Date().toISOString(), isDeleted: false, createdAt: new Date().toISOString() },
            { _id: "2", agentVersion: "1.0.0", os: "linux", upgradeType: "Optional", compatibleOS: ["linux"], buildDate: new Date().toISOString(), isDeleted: false, createdAt: new Date().toISOString() },
            { _id: "3", agentVersion: "1.1.0", os: "windows", upgradeType: "Mandatory", compatibleOS: ["windows"], buildDate: new Date().toISOString(), isDeleted: false, createdAt: new Date().toISOString() },
            { _id: "4", agentVersion: "1.1.1", os: "linux", upgradeType: "Optional", compatibleOS: ["linux"], buildDate: new Date().toISOString(), isDeleted: false, createdAt: new Date().toISOString() },
            { _id: "5", agentVersion: "1.1.2", os: "windows", upgradeType: "Mandatory", compatibleOS: ["windows"], buildDate: new Date().toISOString(), isDeleted: false, createdAt: new Date().toISOString() },
            { _id: "6", agentVersion: "1.2.1", os: "linux", upgradeType: "Optional", compatibleOS: ["linux"], buildDate: new Date().toISOString(), isDeleted: false, createdAt: new Date().toISOString() }
        ];

        // Apply filters from query parameters
        let filteredVersions = [...allVersions];
        
        // Filter by OS
        if (req.query.operatingSystem) {
            const osFilters = req.query.operatingSystem.split(',').map(os => os.toLowerCase());
            filteredVersions = filteredVersions.filter(v => osFilters.includes(v.os.toLowerCase()));
        }
        
        // Filter by upgrade type
        if (req.query.upgradeType) {
            const typeFilters = req.query.upgradeType.split(',');
            filteredVersions = filteredVersions.filter(v => typeFilters.includes(v.upgradeType));
        }
        
        // Filter by agent version
        if (req.query.agentVersion) {
            const versionFilters = req.query.agentVersion.split(',');
            filteredVersions = filteredVersions.filter(v => versionFilters.includes(v.agentVersion));
        }

        // Extract unique versions for filter dropdown
        const allAvailableVersions = [...new Set(allVersions.map(v => v.agentVersion))].sort();
        
        const dummyData = {
            versionData: filteredVersions,
            filterData: { 
                os: ["windows", "linux"], 
                upgradeType: ["Mandatory", "Optional"],
                availableVersions: allAvailableVersions
            },
            pagination: { 
                totalRecords: filteredVersions.length, 
                totalPages: Math.ceil(filteredVersions.length / 10), 
                currentPage: 1, 
                limit: 10 
            }
        };
        
        return responseHandler(res, null, messages.SUCCESS, dummyData, responseCodes.SUCCESS)
    }
    catch (err) {
        return responseHandler(res, err.stack, messages.SERVER_ERROR, [], responseCodes.SERVER_ERROR);
    }
}

const deleteVersion = async (req, res) => {
    try {
        const { id } = req.params;
        let [deleteErr, deletedVersion] = await to(softDeleteVersion(id));
        if (deleteErr) {
            return responseHandler(
                res,
                deleteErr.stack,
                messages.SERVER_ERROR,
                [],
                responseCodes.SERVER_ERROR
            )
        }
        if (deletedVersion === "Invalid ObjectId") {
            return responseHandler(
                res,
                true,
                deletedVersion,
                [],
                responseCodes.ERROR
            )
        }
        else if (deletedVersion === "Version not found") {
            return responseHandler(
                res,
                true,
                deletedVersion,
                [],
                responseCodes.NOT_FOUND
            )
        }
        return responseHandler(
            res,
            null,
            messages.SUCCESS,
            deletedVersion,
            responseCodes.SUCCESS
        )
    }
    catch (err) {
        return responseHandler(
            res,
            err.stack,
            messages.SERVER_ERROR,
            [],
            responseCodes.SERVER_ERROR
        );
    }
}

const updateVersion = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        let [updateErr, updatedVersion] = await to(updateVersionService(id, updateData));
        if (updateErr) {
            return responseHandler(
                res,
                updateErr.stack,
                messages.SERVER_ERROR,
                [],
                responseCodes.SERVER_ERROR
            )
        }
        if (updatedVersion === "Invalid ObjectId") {
            return responseHandler(
                res,
                true,
                updatedVersion,
                [],
                responseCodes.ERROR
            )
        }
        else if (updatedVersion === "Version not found") {
            return responseHandler(
                res,
                true,
                updatedVersion,
                [],
                responseCodes.NOT_FOUND
            )
        }
        return responseHandler(
            res,
            null,
            messages.SUCCESS,
            updatedVersion,
            responseCodes.SUCCESS
        )
    }
    catch (err) {
        return responseHandler(
            res,
            err.stack,
            messages.SERVER_ERROR,
            [],
            responseCodes.SERVER_ERROR
        );
    }
}

module.exports = { createVersion, fetchVersions, deleteVersion, updateVersion };