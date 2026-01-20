const { getParam } = require('./ssm');

/**
 * SSM Authentication Utilities
 * Handles retrieval of authentication keys and certificates from AWS SSM
 */

/**
 * Get private key from SSM for token signing
 * @returns {string} Private key in PEM format
 */
const getPrivateKeyFromSSM = async () => {
    try {
        const privateKeyParam = process.env.PREDEV_JWT_TOKEN_PRIVATE_KEY;
        const result = await getParam(privateKeyParam);
        return result.Parameter.Value;
    } catch (error) {
        console.error('Error retrieving private key from SSM:', error);
        throw new Error('Failed to retrieve private key from SSM');
    }
};

/**
 * Get public certificate from SSM for token verification
 * @returns {string} Public certificate in PEM format
 */
const getCertificateFromSSM = async () => {
    try {
        const certParam = process.env.PREDEV_JWT_TOKEN_PUBLIC_KEY;
        const result = await getParam(certParam);
        console.log(`Retrieved certificate: ${result.Parameter.Value}`);
        
        return result.Parameter.Value;
    } catch (error) {
        console.error('Error retrieving certificate from SSM:', error);
        throw new Error('Failed to retrieve certificate from SSM');
    }
};

/**
 * Get service credentials from SSM
 * @param {string} serviceId - Service identifier
 * @returns {Object} Service credentials
 */
const getServiceCredentials = async (serviceId) => {
    try {
        const credParam = `/agent/services/${serviceId}/credentials`;
        const result = await getParam(credParam);
        return JSON.parse(result.Parameter.Value);
    } catch (error) {
        console.error(`Error retrieving credentials for service ${serviceId}:`, error);
        throw new Error(`Failed to retrieve credentials for service ${serviceId}`);
    }
};

/**
 * Cache for frequently accessed keys (optional optimization)
 */
const keyCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached private key or fetch from SSM
 * @returns {string} Private key
 */
const getCachedPrivateKey = async () => {
    const cacheKey = 'private-key';
    const cached = keyCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.value;
    }
    
    const privateKey = await getPrivateKeyFromSSM();
    keyCache.set(cacheKey, {
        value: privateKey,
        timestamp: Date.now()
    });
    
    return privateKey;
};

/**
 * Get cached public certificate or fetch from SSM
 * @returns {string} Public certificate
 */
const getCachedCertificate = async () => {
    const cacheKey = 'public-cert';
    const cached = keyCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.value;
    }
    
    const certificate = await getCertificateFromSSM();
    keyCache.set(cacheKey, {
        value: certificate,
        timestamp: Date.now()
    });
    
    return certificate;
};

module.exports = {
    getPrivateKeyFromSSM,
    getCertificateFromSSM,
    getServiceCredentials,
    getCachedPrivateKey,
    getCachedCertificate
};