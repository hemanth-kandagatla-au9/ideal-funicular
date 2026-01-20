const mongoose = require('mongoose');

const agentVersionSchema = mongoose.Schema({
    id: {
        type: mongoose.Types.ObjectId,
    },
    agentVersion: {
        type: String,
        required: [true, 'agentVersion is required']
    },
    compatibleOS: {
        type: [
            {
                agentType: {
                    type: String
                },
                osVersion: {
                    type: String
                }
            }
        ],
        required: [true, 'compatibleOS is required']
    },
    releaseDate: {
        type: Date,
        required: [true, 'releaseDate is required']
    },
    versionStatus: {
        type: String,
        required: [true, 'versionStatus is required']
    },
    upgradeType: {
        type: String,
        required: [true, 'upgradeType is required']
    },
    checksumValid: {
        type: Boolean,
    },
    checksum: {
        type: String,
    },
    buildDate: {
        type: String,
    },
    rustcversion: {
        type: String,
    },
    agentpath: {
        type: String,
    },
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    }
}, { timestamps: false }); // Disable automatic timestamps to preserve original ones

const AgentVersionModel = mongoose.model("agents_versions", agentVersionSchema);
module.exports = AgentVersionModel;