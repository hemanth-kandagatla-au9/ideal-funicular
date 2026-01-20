const { generateToken, validateToken } = require('../services/tokenService');
const responseCodes = require('../../utils/responseCodes');
const responseHandler = require('../../utils/responseHandler');


/**
 * Token Controller
 * Handles HTTP requests for token generation and validation
 */

/**
 * Generate JWT Token
 * GET /auth/generate-token
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function generateTokenEndpoint(req, res) {
  try {
   
    const authHeader = req.headers['authorization'];

if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  // Decode base64 part
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [username,password] = credentials.split(':');

  console.log('Username:', username);    
  const tokenData = await generateToken(username,password);
    if(tokenData.length==0){
      return responseHandler(
      res,
      null,
      'Username or password is not valid',
      tokenData,
      responseCodes.NOT_FOUND
    );
    }

    return responseHandler(
      res,
      null,
      'Token Generation Success',
      tokenData,
      responseCodes.SUCCESS
    );

  } catch (error) {
    return responseHandler(
      res,
      error.message || 'Token generation failed',
      'Internal Server Error',
      [],
      responseCodes.SERVER_ERROR
    );
  }
}

/**
 * Validate JWT Token - Works as both endpoint and middleware
 * Can be used as:
 * 1. HTTP endpoint: POST /auth/validate-token
 * 2. Middleware: router.get('/protected', validateTokenEndpoint, handler)
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function (optional, for middleware use)
 */
async function validateTokenEndpoint(req, res, next) {
  try {
    // Extract Authorization header
    const authHeader = req.headers['authorization'];
    console.log("Auth Header 1222:", authHeader  );
    if (!authHeader) {
      const statusCode = next ? responseCodes.UNAUTHORIZED : responseCodes.BAD_REQUEST;
      return responseHandler(
        res,
        'Authentication Token is required',
        'Missing Authorization Header',
        [],
        statusCode
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
    return res.status(401).json({ message: 'Bearer token missing' });
  }

    // Validate the JWT token

    const validationResult = await validateToken(token);
    console.log("Validation Result:", validationResult );
    if (validationResult.valid) {
      // Return success response
      return responseHandler(
        res,
        null,
        'Token is valid',
        {
          valid: true,
          payload: validationResult.payload,
          tokenLength: token.length,
          validationTimestamp: new Date().toISOString()
        },
        responseCodes.SUCCESS
      );
    } else {
      return responseHandler(
        res,
        'Invalid or expired token',
        'Token Validation Failed',
        {
          ...validationResult,
          tokenLength: token.length,
          validationTimestamp: new Date().toISOString()
        },
        responseCodes.UNAUTHORIZED
      );
    }

  } catch (error) {
    console.error('Token validation error:', error);
    return responseHandler(
      res,
      error.message || 'Token validation failed',
      'Internal Server Error',
      {
        error: 'Token validation service error',
        timestamp: new Date().toISOString()
      },
      responseCodes.SERVER_ERROR
    );
  }
}

/**
 * Health check endpoint for authentication service
 * GET /auth/health
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function healthCheck(req, res) {
  try {
    const { validateSSMKeys } = require('../services/tokenService');
    
    const ssmKeysValid = await validateSSMKeys();
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      ssmKeys: ssmKeysValid ? 'accessible' : 'not accessible',
      service: 'risebot-auth-service',
      version: '1.0.0'
    };

    if (!ssmKeysValid) {
      return responseHandler(
        res,
        'Authentication service is partially unavailable - SSM keys not accessible',
        'Service Health Warning',
        healthData,
        responseCodes.SERVER_ERROR
      );
    }

    return responseHandler(
      res,
      'Authentication service is healthy',
      'Service Health Check',
      healthData,
      responseCodes.SUCCESS
    );

  } catch (error) {
    console.error('Health check error:', error);
    return responseHandler(
      res,
      'Authentication service health check failed',
      'Service Health Error',
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      },
      responseCodes.SERVER_ERROR
    );
  }
}

module.exports = {
  generateTokenEndpoint,
  validateTokenEndpoint,
  healthCheck
};