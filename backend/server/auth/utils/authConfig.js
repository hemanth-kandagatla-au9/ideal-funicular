/**
 * Authentication Configuration
 * Contains all configuration constants for the JWT authentication system
 */



// JWT Configuration
const JWT_CONFIG = {
  issuer: process.env.JWT_ISSUER || "risebot-auth-service",
  audience: process.env.JWT_AUDIENCE || "risebot-agents", 
  algorithm: "RS256",
  expiresIn: process.env.JWT_EXPIRATION || 3600
};

// SSM Parameter Store paths for RSA keys
const SSM_PATHS = {
  privateKey: process.env.SSM_RSA_PRIVATE_KEY_PARAM || "/risebot/auth/rsa-private-key",
  publicKey: process.env.SSM_RSA_PUBLIC_KEY_PARAM || "/risebot/auth/rsa-public-key"
};

// Token payload structure
const TOKEN_PAYLOAD_TEMPLATE = {
  
};

/**
 * Get JWT configuration
 * @returns {object} JWT configuration object
 */
function getJWTConfig() {
  return { ...JWT_CONFIG };
}

/**
 * Get SSM paths for key retrieval
 * @returns {object} SSM paths object
 */
function getSSMPaths() {
  return { ...SSM_PATHS };
}

/**
 * Get token payload template
 * @returns {object} Token payload template
 */
function getTokenPayloadTemplate(sub,roles) {
  return { ...TOKEN_PAYLOAD_TEMPLATE, sub, roles };
}



module.exports = {
  getJWTConfig,
  getSSMPaths,
  getTokenPayloadTemplate

};