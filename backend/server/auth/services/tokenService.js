const jwt = require('jsonwebtoken');
const {getCachedPrivateKey, getCachedCertificate,getPrivateKeyFromSSM,getCertificateFromSSM } = require('../../utils/ssmAuthUtils');
const { getJWTConfig } = require('../utils/authConfig');
const agentUserDataModel = require('../../models/agentUserDetails');
const tokenLogs =  require('../../models/tokenLogs');
const path  = require('path')
const fs = require('fs')
const bcrypt =  require('bcrypt')



/**
 * Token Service
 * Handles JWT token generation and validation using RSA256 with keys from AWS SSM
 */

// RSA key caching is now handled by ssmAuthUtils

/**
 * Get RSA private key from SSM with caching
 * @returns {Promise<string>} RSA private key in PEM format
 */
async function getPrivateKey() {
  try {
    return await getCachedPrivateKey();
  } catch (error) {
    console.error('Error retrieving RSA private key:', error);
    throw new Error(`Failed to retrieve RSA private key: ${error.message}`);
  }
}


/**
 * Get RSA public key/certificate from SSM with caching
 * @returns {Promise<string>} RSA public certificate in PEM format
 */
async function getPublicKey() {
  try {
    return await getCachedCertificate();
  } catch (error) {
    console.error('Error retrieving RSA public key:', error);
    throw new Error(`Failed to retrieve RSA public key: ${error.message}`);
  }
}


/**
 * Generate JWT token with RSA256 signing
 * @param {string} username - Username from authorization header
 * @returns {Promise<object>} Token information object
 * 
 */


async function getPrivateKeyData() {
  try {

  const filePath = path.join(__dirname,"../../../",process.env.JWT_PRIVATE_KEY|| 'private-key.pem');    
  
   if (fs.existsSync(filePath)) {
        const privateKey = fs.readFileSync(filePath, 'utf8');
        return privateKey 
                  
        } else {
           const pemData = await getPrivateKeyFromSSM();
           const privateKey =  pemData
          fs.writeFileSync(filePath, pemData);
          return privateKey

        }

  } catch (error) {
    console.error('Error retrieving RSA public key:', error);
    throw new Error(`Failed to retrieve RSA public key: ${error.message}`);
  }
}

async function getPublicKeyData() {
  try {

  const filePath = path.join(__dirname,"../../../",process.env.JWT_PUBLIC_KEY || 'public-key.pem');    
  console.log('filePath>>',filePath)
  
   if (fs.existsSync(filePath)) {
        const publicKey = fs.readFileSync(filePath, 'utf8');
        console.log('privatekeyValue>>',publicKey)
        return publicKey 
                  
        } else {
           const pemData = await getCertificateFromSSM();
           const publicKey =  pemData
          fs.writeFileSync(filePath, pemData);
          return publicKey

        }


  } catch (error) {
    console.error('Error retrieving RSA public key:', error);
    throw new Error(`Failed to retrieve RSA public key: ${error.message}`);
  }
}

async function generateToken(username,password) {
  try {

  
    const privateKey = await getPrivateKeyData();

    const jwtConfig = getJWTConfig();
    const expireTime = jwtConfig.expiresIn
    console.log('typeof',typeof(expireTime))
    
     // Fetch user roles from database
    
    let roles = [];
    const agentRoleDoc = await agentUserDataModel.findOne({ 
      username: username 
     
    });
    console.log('agentRoleDoc',agentRoleDoc)

    if(!agentRoleDoc) {
      return []
    }
    if(!agentRoleDoc.isActive){
     throw new Error("User is inactive or not found");
    }
    
    const stringinfyData = JSON.stringify(agentRoleDoc)
    const parsedData = JSON.parse(stringinfyData)
    const hashedPassword = parsedData.password
    const isMatch = await bcrypt.compare(password, hashedPassword);
      console.log('isMatch',isMatch)
      if(!isMatch){
        return []
      }
     
    if (parsedData && parsedData.roles) {
      roles = agentRoleDoc.roles;
    } 
    
    const payload = {
      sub: username,
      roles: roles
    };

  
    const token = jwt.sign(payload, privateKey, { algorithm: jwtConfig.algorithm, expiresIn:`${expireTime}s` });

   await tokenLogs.create({
    username,
    token,
    action: "GENERATED",
    expiresTime: new Date(Date.now() + expireTime * 1000)
  })
    return {
      token,
      tokenType: "Bearer",
      expiresIn: parseInt(expireTime)
    };
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error(`Token generation failed: ${error.message}`);
  }
}

/**
 * Validate JWT token using RSA256 verification
 * @param {string} token - JWT token to validate
 * @returns {Promise<object>} Validation result object
 */
async function validateToken(token) {
  try {
    if (!token) {
      return {
        valid: false,
        reason: "Token is required"
      };
    }
    const publicKey = await getPublicKeyData();
    
    const jwtConfig = getJWTConfig();

    const decoded = jwt.verify(token, publicKey, { algorithms: [jwtConfig.algorithm] });
    console.log('decoded>>',decoded)
    await tokenLogs.findOneAndUpdate(
  { username: decoded.sub },      
  { action: "SUCCESS" },             
  { sort: { createdAt: -1 }, new: true }
);
    return {
      valid: true,
      payload: decoded
    };
  } catch (error) {
    console.error('Token validation error:', error);
    
     // decode token to get username
    
    let reason = "Invalid token";
    let user
    let incorrectTOkenCount 
    if (error.name === 'TokenExpiredError') {
      reason = "Token has expired";
    } else if (error.name === 'JsonWebTokenError') {
      reason = "Invalid token format or signature";
      const decoded = jwt.decode(token);
      console.log('decoded>>',decoded)

       user = await tokenLogs.findOne({username:decoded.sub}).sort({ createdAt: -1 });
       console.log('user>>',user)

      if (user) {
      incorrectTOkenCount =  user.wrongTokenCount+1
        
    if (user.wrongTokenCount >= 3) {

     await agentUserDataModel.findOneAndUpdate(
   { username: user.username },      
   { isActive: false},             

);
    }
  }
}
console.log('incorrectTOkenCount>>',incorrectTOkenCount )
  await tokenLogs.updateOne(
  { _id: user._id },
  {
    $set: {
      action: "FAILED",
      wrongTokenCount: incorrectTOkenCount
    }
  }
);

    return {
      valid: false,
      reason: reason
    };
  
  }
}
  


/**
 * Check if SSM keys are accessible
 * @returns {Promise<boolean>} True if keys are accessible
 */
async function validateSSMKeys() {
  try {
    await getPrivateKey();
    await getPublicKey();
    return true;
  } catch (error) {
    console.error('SSM key validation failed:', error);
    return false;
  }
}

module.exports = {
  generateToken,
  validateToken,
  validateSSMKeys
  };