require("dotenv").config();
const { getOpenSearchPassword } = require("./envUtils");
const fetch = require('node-fetch');

const extractUsernameFromToken = (req) => {
    const token = req.header('authorization')?.replace('Bearer ', '');

    if (token) {
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf-8'));
        return decoded?.jnjMSUsername || 'unknown';
    }

    return 'unknown';
};

const checkAndCreateIndex = async (indexName) => {
    const username = process.env.OPENSEARCH_USER;
    const password = process.env.OPENSEARCH_NON_PROD_PASSWORD || await getOpenSearchPassword();
    const headers = {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`, "utf-8").toString("base64")}`,
        'Content-Type': 'application/json',
    };
    const indexUrl = `${process.env.OPENSEARCH_URL}/${indexName}`;

    const headResponse = await fetch(indexUrl, { method: 'HEAD', headers });

    if (headResponse.status === 404) {
        const createIndexResponse = await fetch(indexUrl, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                settings: {
                    number_of_shards: 1,
                    number_of_replicas: 0,
                },
                mappings: {
                    properties: {
                        hostname: { type: 'keyword' },
                        origin: { type: 'keyword' },
                        ip: { type: 'ip' },
                        user: { type: 'keyword' },
                        endpoint: { type: 'keyword' },
                        level: { type: 'keyword' },
                        loggername: { type: 'keyword' },
                        message: { type: 'text' },
                        timestamp: { type: 'date' },
                    },
                },
            }),
        });

        if (!createIndexResponse.ok) {
            console.log(`Failed to create index: ${await createIndexResponse.text()}`);
        }
    }
};
const getIpAddress = (req) => {
    const ip = req.ip || req.connection.remoteAddress;
    return ip.startsWith('::ffff:') ? ip.slice(7) : ip;
};
const logDataToOpenSearch = async (level, req, message, hostname) => {
    const user = extractUsernameFromToken(req);
    const logData = {
        hostname: req.body.hostname || hostname,
        user,
        endpoint: req.originalUrl,
        level,
        message,
        loggername: "risebot::UI",
        ip: getIpAddress(req),
        origin: req.get('Origin'),
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),

    };

    const indexName = process.env.OPENSEARCH_AUDIT_LOG_INDEX;
    await checkAndCreateIndex(indexName);

    const username = process.env.OPENSEARCH_USER;
    const password = process.env.OPENSEARCH_NON_PROD_PASSWORD || await getOpenSearchPassword();
    const OPENSEARCH_URL = `${process.env.OPENSEARCH_URL}/${indexName}/_doc`;

    const headers = {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`, "utf-8").toString("base64")}`,
        'Content-Type': 'application/json',
    };

    const requestOptions = {
        method: "POST",
        headers,
        body: JSON.stringify(logData),
    };
    try {
        const response = await fetch(OPENSEARCH_URL, requestOptions);
        if (!response.ok) {
            console.log(`Failed to log data: ${await response.text()}`);
        }
    } catch (e) {
        console.log(e);
    }
};

const LOGGER = {
    errorLog: (req, message, hostname = null) => logDataToOpenSearch('error', req, message, hostname),
    infoLog: (req, message, hostname = null) => logDataToOpenSearch('info', req, message, hostname),
    warningLog: (req, message, hostname = null) => logDataToOpenSearch('warning', req, message, hostname),
};

module.exports = { LOGGER, extractUsernameFromToken };