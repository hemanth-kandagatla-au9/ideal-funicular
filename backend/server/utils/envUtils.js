//Import dependences
require("dotenv").config();
const { getParam } = require("./ssm.js");

const getRustPassword = async () => {
  const res = await getParam(process.env.RUST_API_PASSWORD);
  return res.Parameter.Value;
};
const getOpenSearchPassword = async () => {
  const res = await getParam(process.env.OPENSEARCH_PASSWORD);
  return res.Parameter.Value;
};

const getServiceAccountPassword = async () => {
  const res = await getParam(process.env.RISE_SA_PASSWORD);
  return res.Parameter.Value;
};

const getMongoConnectionURL = async () => {
  const res = await getParam(process.env.MONGO_CONNECTION_URL);
 console.log('getMongoConnectionURL',res)
  return res.Parameter.Value;
};
const getMongoPem = async () => {
  const res = await getParam(process.env.MONGO_TLS_PEM_FILE);
  console.log('getMongoPem>>',res)
  return res?.Parameter?.Value;
};

const GENERATE_TOKEN_URL  = 'https://dev.agent.ias.apps.jnj.com'

const getMSALClientID = async () => {
  const res = await getParam(process.env.MSAL_CLIENT_ID);
  return res?.Parameter.Value;
};

const getMSALTenantID = async () => {
  const res = await getParam(process.env.MSAL_TENANT_ID);
  return res?.Parameter.Value;
};


module.exports = {
  getMongoPem, getMongoConnectionURL,
  getRustPassword,
  getOpenSearchPassword,
  getServiceAccountPassword,
  GENERATE_TOKEN_URL,
  getMSALClientID,
  getMSALTenantID
};