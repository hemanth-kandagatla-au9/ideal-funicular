const mongoose = require('mongoose');

const appConfigSchema = mongoose.Schema({
    id: {
        type: mongoose.Types.ObjectId
    },
    appname: {
        type: String
    },
}, { timestamps: true });

const AppConfigModel = mongoose.model("app_config", appConfigSchema);
module.exports = AppConfigModel;