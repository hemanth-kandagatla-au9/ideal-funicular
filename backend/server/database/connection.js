// const { MongoClient } = require("mongodb");
require("dotenv").config();
const { getMongoConnectionURL, getMongoPem } = require("../utils/envUtils");
const { APP_CONFIG } = require("../../config");
const mongoose = require('mongoose');
const path = require("path");
const fs = require("fs");

const getTlsOptions = async () => {
    return {
        tls: false,
        authSource: 'admin',
        ...APP_CONFIG.MONGO.OPTIONS,
    };
};

let mongooseConnection;

const InitiateMongoServer = async () => {
    try {
        if (!mongooseConnection) {
            if (process.env.NODE_ENV === "test") return mongooseConnection;
            let mongoConnectionURL = process.env.DB_CONNECTION_URL ? process.env.DB_CONNECTION_URL : await getMongoConnectionURL();
            const dbname = process.env.DATABASE ?? "risebot";
            mongoConnectionURL = `mongodb://${mongoConnectionURL}${dbname}`;
            const tlsOptions = await getTlsOptions();
            console.log('tlsOptions',tlsOptions)
            if (process.env.MONGO_TLS_ENABLED === true) {
                const filePath = path.join(
                    __dirname,
                    "../../",
                    process.env.MONGO_KEY || "mongo-sbx-ca.pem"
                );

                if (fs.existsSync(filePath)) {
                    tlsOptions.tls = false;
                    tlsOptions.ssl = false;
                    tlsOptions.tlsCAFile = filePath;
                } else {
                    const pemData = await getMongoPem();

                    fs.writeFileSync(filePath, pemData);
                    tlsOptions.tls = false;
                    tlsOptions.tlsCAFile = filePath;
                }
            } else {
                console.log("MongoDB TLS not required");
            }

            const mongooseConnection = await mongoose.connect(
                mongoConnectionURL,
                tlsOptions
            )
        }
        mongoose.set('debug', true);
        console.log(`Connected to DB!!!`);
    }
    catch (e) {
        console.log(`Mongo Connection Err: ${e.message}`);
    }
}


module.exports = {
    InitiateMongoServer,
    getTlsOptions,
};