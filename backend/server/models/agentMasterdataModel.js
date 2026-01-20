const mongoose = require('mongoose');

const agentMasterdataSchema = mongoose.Schema({
    id: {
        type: mongoose.Types.ObjectId
    },
    hostname: {
        type: String
    },
}, { timestamps: true });

const AgentMasterdataModel = mongoose.model("agent_masterdata", agentMasterdataSchema);
module.exports = AgentMasterdataModel;