const mongoose = require('mongoose');

const versionsSchema = mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId
        // No auto: true - we want to preserve the existing _id from the collection
    },
    version: {
        type: String,
        required: [true, 'version is required']
    },
    buildDate: {
        type: String,
        required: [true, 'buildDate is required']
    },
    checksum: {
        type: String
    },
    agentType: {
        type: String
    },
    agentPath: {
        type: String
    },
    rustVersion: {
        type: String
    }
}, { 
    timestamps: true,
    collection: 'versions'
});

const VersionsModel = mongoose.model("versions", versionsSchema);
module.exports = VersionsModel;