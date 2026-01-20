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
        req.query.isDeleted = false;
        let [fetchErr, fetchedVersions] = await to(getVersions(req.query));
        if (fetchErr) {
            return responseHandler(
                res,
                fetchErr.stack,
                messages.SERVER_ERROR,
                [],
                responseCodes.SERVER_ERROR
            )
        }
        return responseHandler(
            res,
            null,
            messages.SUCCESS,
            fetchedVersions,
            responseCodes.SUCCESS
        )
    }
    catch (err) {
        console.log(`error fetching versions => ${err}`);
        return responseHandler(
            res,
            err.stack,
            messages.SERVER_ERROR,
            [],
            responseCodes.SERVER_ERROR
        );
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
        console.log(`error deleting versions => ${err}`);
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
        console.log(`error deleting versions => ${err}`);
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