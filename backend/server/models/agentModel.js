const mongoose = require('mongoose');

const agentSchema = mongoose.Schema({
    id: {
        type: mongoose.Types.ObjectId
    },
    hostname: {
        type: String
    },
    agent_config: {
        type: Object
    },
    agent_details: {
        type: Object
    },
    agent_local_config: {
        type: Object
    },
    jobs: {
        type: Array
    },
    timestamp: {
        type: Date
    },
    status: {
        type: String
    },
    os: {
        type: String
    },
    risebot: {
        type: Object
    },
    risebotProperties: {
        type: Object
    },
    cmdb: {
        type: Object
    }
}, { timestamps: true });

const AgentModel = mongoose.model("agents", agentSchema);
module.exports = AgentModel;