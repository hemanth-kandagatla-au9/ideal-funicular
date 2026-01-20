const mongoose = require('mongoose');

const sapMasterdataSchema = mongoose.Schema({
    id: {
        type: mongoose.Types.ObjectId
    },
    ciOsVmHostname: {
        type: String
    },
}, { timestamps: true });

const SapMasterdataModel = mongoose.model("sap_masterdatas", sapMasterdataSchema);
module.exports = SapMasterdataModel;