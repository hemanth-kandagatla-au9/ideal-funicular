const { LOGGER } = require('./opensearchLogger');
const { Client } = require('ssh2');
const AgentModel = require("../models/agentModel");
const { getServiceAccountPassword } = require("./envUtils");
const responseCodes = require("./responseCodes");

const executeCommandOnAgent = async (req, hostname, osVersion, res, isBulk = false) => {
    const SERVICE_ACCOUNT_USERNAME = process.env.RISE_SA_USERNAME;
    console.log('SERVICE_ACCOUNT_USERNAME',SERVICE_ACCOUNT_USERNAME)
    const SERVICE_ACCOUNT_PASSWORD = process.env.RISE_SA_PASSWORD_VALUE ? process.env.RISE_SA_PASSWORD_VALUE : await getServiceAccountPassword();
    console.log('ERVICE_ACCOUNT_PASSWORD',SERVICE_ACCOUNT_PASSWORD)

    const sshConfig = {
        username: SERVICE_ACCOUNT_USERNAME,
        password: SERVICE_ACCOUNT_PASSWORD,
        host: hostname,
        port: 22,
        readyTimeout: 60000,
    };

    const startCommand = getStartCommand(osVersion ?? "7.10");
    const commandTimeout = 60000;
    const client = new Client();

    try {
        await new Promise((resolve, reject) => {
            client.on('error', (error) => {
                LOGGER.errorLog(req, `Connection error: ${error.message}`, hostname);
                reject(error);
            });
            client.on('ready', () => {
                LOGGER.infoLog(req, 'SSH connection established successfully.', hostname);
                resolve();
            });
            client.connect(sshConfig);
        });

        client.exec(startCommand, (err, stream) => {
            if (err) {
                LOGGER.errorLog(req, `User attempted to start the RiseBot, but it failed due to: ${err.message}`, hostname);
                if (!isBulk) {
                    res.status(responseCodes.SERVER_ERROR).json({ flag: 'error', error: err.message });
                }
                return;
            }

            let commandOutput = '';
            let timeoutId = setTimeout(() => {
                stream.close();
                LOGGER.warningLog(req, 'Command execution timed out.');
                if (!isBulk) {
                    res.status(responseCodes.SERVER_ERROR).json({ flag: 'error', error: 'Command execution timed out.', hostname });
                }
            }, commandTimeout);

            stream.on('data', (data) => {
                commandOutput += data.toString();
            });

            stream.on('close', (code) => {
                clearTimeout(timeoutId);
                if (code !== 0) {
                    LOGGER.warningLog(req, `User attempted to start the RiseBot, but it failed due to a non-zero exit code: ${code}.`, hostname);
                    if (!isBulk) {
                        res.status(responseCodes.SERVER_ERROR).json({ flag: 'error', error: `Non-zero exit code: ${code}` });
                    }
                } else {
                    LOGGER.infoLog(req, `User successfully started the RiseBot service from the Agent UI.`, hostname);
                    if (!isBulk) {
                        res.status(responseCodes.SUCCESS).json({ flag: 'success', data: { message: "started", output: commandOutput } });
                    }
                }
                client.end();
            });
        });
    } catch (error) {
        LOGGER.errorLog(req, `User attempted to start the RiseBot, but it failed due to: ${error.message}`, hostname);
        if (!isBulk) {
            res.status(responseCodes.SERVER_ERROR).json({ flag: 'error', error: error.message });
        }
    }
};

const getStartCommand = (osVersion) => {
    // return osVersion.includes('6.') ? 'sudo service risebot start' : 'sudo systemctl start risebot';
    return osVersion.includes('6.') ? 'sudo service riseagent start' : 'sudo systemctl start riseagent';
};

const handleApiResponse = async (req, res, apiFunction) => {
    try {
        let hostName = req.body.hostname || req.query.hostname;
        const authHeader = req.headers['authorization'] ||'';
        let base64Credentials
        if(authHeader){
        if (!authHeader || !authHeader.startsWith('Basic')) {
         return res.status(401).json({ message: 'Missing or invalid Authorization header' });
        }
       base64Credentials = authHeader.split(' ')[1];
       }

  
        let port = 20101;
        if (hostName) {
            const result = await AgentModel.findOne({ hostname: hostName });
            if (!result?.agent_details) return res.status(responseCodes.NOT_FOUND).json({ flag: "error", error: "Host not found", data: {} });
            port = result.agent_details.server_port;
        }

        req.body = { ...req.body, "port": port ,base64Credentials}

        let requestData = {};
        requestData = { ...req.query, ...req.body };
        console.log('requestData>>>',requestData)
        console.log('apiFunction',requestData,apiFunction)
        const data = await apiFunction(requestData);
        console.log('Data>>',data)

        if (data === undefined) {
            res.status(responseCodes.SUCCESS).json({ flag: "error", error: "Unable to connect to server " + req.body.hostname, data: {} });
        }
        else if (data.status === responseCodes.NOT_FOUND) {
            res.status(responseCodes.NOT_FOUND).json({ flag: "error", error: "File Not found" });
        }
        else if (data.status === responseCodes.SERVER_ERROR) {
            res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: "Unable to connect to server" });
        }

        else {
            if (data.type === "buffer") {
                res.set('Content-Type', data.contentType);
                res.status(responseCodes.SUCCESS).send(data.data);
            }
            else {
                res.status(responseCodes.SUCCESS).json({ flag: "success", data });

            }

        }

    }
    catch (error) {
        console.log('err>>',error.message)
        res.status(responseCodes.SERVER_ERROR).json({ flag: "error", error: error.message });
    }
};

const buildQuery = (reqbody) => {
    const query = {};

    // Add filters for status, search, hostnameArr
    if (reqbody.status && reqbody.status !== 'Recent') {
        query.status = reqbody.status;
    }
    if (reqbody.search && reqbody.search.trim() !== '') {
        query.hostname = { $regex: new RegExp(reqbody.search, 'i') };
    }
    if (reqbody.hostnameArr && reqbody.hostnameArr.trim() !== '') {
        const hostnames = reqbody.hostnameArr.split(',').map(hostname => hostname.trim());
        query.hostname = { $in: hostnames };
    }

    // Add filters for osTypes, regions, environments, platforms, sids, serviceNames
    const filterFields = ['osTypes', 'regions', 'environments', 'platforms', 'sids', 'serviceNames'];
    // filterFields.forEach(field => addFilter(reqbody, query, field));
    filterFields.forEach(field => addFilter(reqbody, query, field, 'cmdb'));

    // Add filter for agentVersions
    addFilter(reqbody, query, 'agentVersions', 'agent_details');
    return query;
};

const addFilter = (reqbody, query, field, prefix) => {
    if (reqbody[field] && reqbody[field].trim() !== '') {
        const values = reqbody[field].split(',').map(value => value.trim());
        // if(prefix){
        query[`${prefix}.${getFieldName(field)}`] = { $in: values };
        
    //     else{
    //     query[`${getFieldName(field)}`] = { $in: values };
    //     }
    }
};

const getFieldName = (field) => {
    // if (field === 'osTypes') return 'os';
    if (field === 'osTypes') return 'ciOsType'
    if (field === 'regions') return 'slRegion';
    if (field === 'environments') return 'ciSapNameEnv';
    if (field === 'platforms') return 'slPlatform';
    if (field === 'sids') return 'ciSapNameSid';
    if (field === 'serviceNames') return 'slName';
    if (field === 'agentVersions') return 'version';
};

const getDistinctValues = async (field, res, successKey, responseKey) => {
    try {
        // const values = await AgentModel.distinct(`${field}`);
        const values = await AgentModel.distinct(`cmdb.${field}`);
        const responseObject = { flag: 'success' };
        responseObject[responseKey] = { [successKey]: values };
        res.status(responseCodes.SUCCESS).json(responseObject);
    } catch (error) {
        res.status(responseCodes.SERVER_ERROR).json({ flag: 'error', message: 'Internal server error' });
    }
};

module.exports = {
    executeCommandOnAgent,
    handleApiResponse,
    buildQuery,
    addFilter,
    getFieldName,
    getDistinctValues,
};