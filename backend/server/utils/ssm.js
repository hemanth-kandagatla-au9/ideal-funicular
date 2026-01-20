"use strict";
const AWS = require("aws-sdk");
/**
 *AWS update.
 */
AWS.config.update({
  region: process.env.AWS_REGION,
  maxRetries: 5,
  retryDelayOptions: { base: 200 },
});
 
const parameterStore = new AWS.SSM();
 
const cache = new Map();
 
const CACHE_TTL_MS = 40 * 60 * 1000;
 
/**
 * Get details of Parameter
 * @param {string} name -
 * @returns {Promise<Object>}
 */
const getParameter = async (name) => {
  const now = Date.now();
 
  const cached = cache.get(name);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return {
      Parameter: {
        Name: name,
        Type: "SecureString",
        Value: cached.value,
      },
    };
  }
 
  try {
    if (process.env.NODE_ENV === "local") {
      return {
        Parameter: {
          Name: "StripeSecretKey",
          Type: "SecureString",
          Value: "myVal",
          Version: 1,
          LastModifiedDate: 1530018761.888,
          ARN: "arn:aws:ssm:us-east-1:123456789012:parameter/helloSecureWorld",
        },
      };
    }
 
    const result = await parameterStore
      .getParameter({ Name: name, WithDecryption: true })
      .promise();
 
    cache.set(name, { value: result.Parameter.Value, timestamp: now });
 
    return result;
 
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching SSM param: ${error.code || error.name} - ${error.message}`);
 
    if (error.code === "ThrottlingException" || error.code === "TooManyRequestsException") {
      console.warn("Throttled by AWS SSM. Consider backing off or using a queue.");
    }
 
    return null;
  }
};
 
const getParam = async (paramName) => getParameter(paramName);
module.exports = { getParam };