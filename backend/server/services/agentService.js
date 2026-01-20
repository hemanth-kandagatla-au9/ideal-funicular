const fetch = require("node-fetch");
const { getOpenSearchPassword} = require("../utils/envUtils");
const responseCodes = require("../utils/responseCodes");
const axios  =  require('axios')
const  tokenLogs =  require('../models/tokenLogs')

require("dotenv").config();

async function generateToken() {
  try {

const username =  process.env.AUTH_USERNAME || 'SA-ITS-AGENT'
const password  = process.env.PASSWORD || 'Rise$12345rise'
console.log('username >>',username,password)

 const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
  const headers = {
  'Authorization': `Basic ${base64Credentials}`,
  'Content-Type': 'application/json'
};
console.log('headers>>',headers)
const API_URL = 'https://dev.agent.ias.apps.jnj.com/api/agent/auth/generate-token';
console.log('API_URL>>',API_URL)
    const response = await fetch(API_URL, {
      method: 'GET', 
      headers
    });

    const data = await response.json();
    console.log('responseData>>',data)

    if (response.status ==200) {
      console.log(data);
      return data.data.token
    } else {
      console.error('Error:', data);
      return ''
    }
  } catch (err) {
    console.log('err',err)
    console.error('Request failed:', err.message);
    return ''
  }
}



const createFetchRequest = async (url, method, data = null) => {

  // const username = process.env.RUST_API_USERNAME;
  // console.log('rustUsername>',username)
  // const password = process.env.RUST_API_PASSWORD ? process.env.RUST_API_PASSWORD : await getRustPassword();
  // console.log('rustpassword>',password)
   const username =  process.env.AUTH_USERNAME || 'SA-ITS-AGENT'

   const user = await tokenLogs.findOne({ username }).sort({ createdAt: -1 });
   let token 
  // If no user or no token → generate new
  if (!user || !user.token || !user.action == 'GENERATED') {
   token  =  await generateToken()
  }

  // Check expiry
  const isExpired = new Date() > user.expiresTime;

  // If token still valid → return same
  if (isExpired) {
    token  =  await generateToken()
  }else{
    token  =  user.token
  }
  
  console.log('token>>',token)
  const headers = {
    // Authorization: `Basic ${Buffer.from(`${username}:${password}`, "utf-8").toString("base64")}`,
    Authorization: `Bearer ${token}`,
  };
  const requestOptions = {
    method,
    headers,
  };
  if (data) {
    headers["Content-Type"] = "application/json";
    requestOptions.body = JSON.stringify(data);
  }

 const response = await axios({
      url,
      method,
      data,
      headers,
      timeout: 5000
    });

  // const response =  await fetch(url, requestOptions);
  console.log('apiResponse>>',response )
  return response
};

const createOpenSearchFetchRequest = async (url, method) => {
  const username = process.env.OPENSEARCH_USER;
  const password = process.env.OPENSEARCH_NON_PROD_PASSWORD ? process.env.OPENSEARCH_NON_PROD_PASSWORD : await getOpenSearchPassword();
  const OPENSEARCH_URL = process.env.OPENSEARCH_URL;
  const headers = {
    Authorization: `Basic ${Buffer.from(`${username}:${password}`, "utf-8").toString("base64")}`,
  };
  const requestOptions = {
    method,
    headers,
  };
  return fetch(OPENSEARCH_URL + url, requestOptions);
};
const createMasterAgentFetchRequest = async (url, method) => {
  const username = process.env.MASTERAGENT_USERNAME;
  const password = process.env.MASTERAGENT_PASSWORD;
  const MASTERAGENT_URL = process.env.MASTERAGENT_URL;
  const headers = {
    Authorization: `Basic ${Buffer.from(`${username}:${password}`, "utf-8").toString("base64")}`,
  };
  const requestOptions = {
    method,
    headers,
  };

  return fetch(MASTERAGENT_URL + url, requestOptions);
};

const fetchData = async (url, method, data = null, isRustAgent = true, isMasterAgent = false, isDownloadApi = false,logsApi = false) => {
  try {
    const response = isMasterAgent ? await createMasterAgentFetchRequest(url, method) : (isRustAgent ? await createFetchRequest(url, method, data) : await createOpenSearchFetchRequest(url, method));
    console.log('fetchDataresponse',response)
    let contentType
    if (response.status === responseCodes.SUCCESS) {
      if(logsApi){
      contentType = response.headers.get('content-type');
      } else{
        contentType = response.headers['content-type'];
      }
      let jsonResponse = {};
      if (isDownloadApi) {
        jsonResponse = { type: "buffer", contentType: contentType, data: await response.buffer() };
      }
      if(logsApi){
        jsonResponse = await response.json();
        return jsonResponse.hits.hits.map(record => record._source).filter(Boolean);
      }
      // else if (contentType.includes('application/json')) {
      //   jsonResponse = await response.json();

        // jsonResponse = response.data;
      // }
      else  {
        // jsonResponse = { type: "unknown", contentType: contentType, data: await response.text() };
        jsonResponse = { type: "unknown", contentType: contentType, data: await response.data };
      }

      if (isRustAgent) {
        return response.data;
      }
      else if (isMasterAgent) {
        const sortedAgentMetaDataResponse = jsonResponse.agentMetaDataResponse.sort((a, b) => Number(b.buildDate) - Number(a.buildDate));
        return { risebotVersions: sortedAgentMetaDataResponse };
      }

    }
    else if (response.status === responseCodes.NOT_FOUND) {
      return { status: responseCodes.NOT_FOUND, message: "File not found" }
    }
  } catch (error) {
     console.log('err>>',error.message)
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND" || error.message) {
      return undefined;
    }
  }

};

const getBaseURL = async host => {
  const hostname = host?.hostname;
  const DEFAULT_PORT = 20140;
  const port = host?.port !== undefined && host?.port !== "undefined" ? host.port : DEFAULT_PORT;
  return `https://${hostname}:${port}`;
};



module.exports = {
  fetchData,
  getBaseURL,
  getHealth: async data => fetchData(`${(await getBaseURL(data))}/agent/status`, "GET"),
  downloadFile: async data => fetchData(`${(await getBaseURL(data))}/agent/download/file`, "POST", data, true, false, true),
  getPid: async data => fetchData(`${(await getBaseURL(data))}/agent/pid`, "GET"),
  getMetric: async data => fetchData(`${(await getBaseURL(data))}/agent/metric`, "GET"),
  getConfig: async data => fetchData(`${(await getBaseURL(data))}/agent/config`, "GET"),
  putShutDown: async data => fetchData(`${(await getBaseURL(data))}/agent/shutdown`, "PUT"),
  putRestartAgent: async data => fetchData(`${(await getBaseURL(data))}/agent/restart`, "PUT"),
  putStart: async data => fetchData(`${(await getBaseURL(data))}/agent/jobs/start`, "PUT"),
  putStop: async data => fetchData(`${(await getBaseURL(data))}/agent/jobs/stop`, "PUT"),
  putRestart: async data => fetchData(`${(await getBaseURL(data))}/agent/jobs/restart`, "PUT"),
  getJobs: async data => fetchData(`${(await getBaseURL(data))}/agent/jobs`, "GET"),
  getJobDetails: async data => fetchData(`${(await getBaseURL(data))}/agent/jobs?name=${data.scheduledJobId}`, "GET"),
  postJob: async data => fetchData(`${(await getBaseURL(data))}/agent/job`, "POST", data),
  updateJob: async data => fetchData(`${(await getBaseURL(data))}/agent/job`, "PUT", data),
  updateVersion: async data => fetchData(`${(await getBaseURL(data))}/agent/version`, "PUT", { "agentpath": data.agentpath, "version": data.version }),
  deleteJob: async data => fetchData(`${await getBaseURL(data)}/agent/job?script_name=${data.scheduledJobId}`, "delete", {}),
  updateLocalConfiguration: async data => fetchData(`${(await getBaseURL(data))}/agent/config`, "PUT", data.propertiesSchemas),
  getApplicationLogs: async data => fetchData(`/${process.env.OPENSEARCH_APPLICATION_INDEX}/_search?from=${data.skip}&size=${data.limit}&sort=timestamp:desc&q=hostname:${data.hostname}`, "POST", data, false,'','',true),
  getJobLogs: async data => fetchData(`/${process.env.OPENSEARCH_APPLICATION_INDEX}/_search?from=${data.skip}&size=${data.limit}&sort=timestamp:desc&q=jobname:${data.jobname}`, "POST", data, false),
  getVersions: async data => fetchData(`/rust-agent/version-list?agentType=rustlinux`, "GET", data, false, true),
  downloadAgent: async data => fetchData(`${(await getBaseURL(data))}/agent/version`, "PUT"),
};