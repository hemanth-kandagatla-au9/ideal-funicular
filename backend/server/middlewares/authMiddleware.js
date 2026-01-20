const jwt  =  require('jsonwebtoken')
const jwksClient = require("jwks-rsa");
const { loadConfig } = require("../utils/mslConfig");
const responseCodes = require("../utils/responseCodes");
// const { error } = require('winston');
let tokenValidationConfigData;
let msalConfig;
 
 
// const configPromise = getConfigs();
 

async function getConfigs() {
    const config = await loadConfig();
    msalConfig = config.msalConfig;
    console.log('msalConfig>>',msalConfig)
    tokenValidationConfigData= config.tokenValidationConfig;
    console.log('tokenValidationConfigData>>',tokenValidationConfigData)
}

const configPromise = getConfigs();
 
// JWKS Caching Implementation
let jwksClientInstance = null;






let keysCache = new Map();
const CACHE_TTL = 3600000; // 1 hour cache

 
// Initialize JWKS client once at startup
const initializeJwksClient = () => {
    if (!jwksClientInstance) {
        jwksClientInstance = jwksClient({
            jwksUri: `${msalConfig.auth.authority}/discovery/v2.0/keys`,
            cache: true,
            cacheMaxEntries: 5,
            cacheMaxAge: CACHE_TTL,
            timeout: 30000,
        });
    }
    return jwksClientInstance;
};
 
const getKey = (header, callback) => {
    const client = initializeJwksClient();
    const cacheKey = header.
    kid;
    const cachedKey = keysCache.get(cacheKey);
   
    // Return cached key if available and not expired
    if (cachedKey && Date.now() - cachedKey.timestamp < CACHE_TTL) {
        return callback(null, cachedKey.key);
    }
 
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            console.error('[JWKS] Error fetching signing key:', err.message);
           
            // If we have a stale cached key, use it as fallback
            if (cachedKey) {
                console.warn('[JWKS] Using stale cached key due to JWKS failure');
                return callback(null, cachedKey.key);
            }
           
            return callback(err, null);
        } else {
            try {
                const signingKey = key.getPublicKey();
               
                // Cache the key
                keysCache.set(cacheKey, {
                    key: signingKey,
                    timestamp: Date.now()
                });
               
                callback(null, signingKey);
            } catch (keyError) {
                console.error('[JWKS] Error extracting public key:', keyError);
                callback(keyError, null);
            }
        }
    });
};
 
// Pre-warm JWKS cache at startup
const preloadJwksKeys = async () => {
    return new Promise((resolve, reject) => {
        const client = initializeJwksClient();
       
        client.getKeys((err, keys) => {
            if (err) {
                console.error('[JWKS] Failed to preload keys:', err);
                reject(err);
                return;
            }
           
            // Cache all keys
            keys.forEach(key => {
                try {
                    const publicKey = key.publicKey || key.rsaPublicKey;
                    if (publicKey) {
                        keysCache.set(key.kid, {
                            key: publicKey,
                            timestamp: Date.now()
                        });
                    }
                } catch (keyError) {
                    console.warn(`[JWKS] Failed to cache key ${key.kid}:`, keyError.message);
                }
            });
           
            //  cacheInitialized = true;
            resolve(keysCache.size);
        });
    });
};
 
// Preload keys when configurations are loaded
configPromise.then(() => {
    preloadJwksKeys()
        .then(count => {
            console.log(`[Startup] JWKS cache preloaded with ${count} keys`);
        })
        .catch(err => {
            console.error('[Startup] JWKS preloading failed, will load on-demand',err);
        });
});
 
//    console.log('tokenValidationConfig',tokenValidationConfigData)

   async function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log("Auth Header 1222:", authHeader  );
    if(!authHeader){
     return res.status(401).json({ message: 'User is not authorized'})   
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }
  
        jwt.verify(
            token,
            getKey,
            {
                algorithms: ["RS256"],
                issuer: tokenValidationConfigData.issuer,
                audience: tokenValidationConfigData.audience,
            },
            async (err) => {
                if (err) {
                    console.log("Auth Error:", err);
                   
                    let errorMessage = "Authentication failed";
                    if (err.message?.includes("Bad Request") || err.message?.includes("getSigningKey")) {
                        errorMessage = "Authentication service temporarily unavailable. Please try again.";
                    } else if (err.message === "jwt expired") {
                        errorMessage = "Session Expired";
                    } else if (err.name === "JsonWebTokenError") {
                        errorMessage = "Invalid token";
                    }
                   
                    return res.status(responseCodes.UNAUTHORIZED).json({
                        success: false,
                        statusCode: responseCodes.UNAUTHORIZED,
                        message: errorMessage,
                    });
                }
               
                next();
            }
        );
    }
 
module.exports = authMiddleware;