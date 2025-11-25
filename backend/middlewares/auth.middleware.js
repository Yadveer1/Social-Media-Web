import User from "../models/user.model.js";

/**
 * Extract token from Authorization header
 * @param {Request} req - Express request object
 * @returns {string|null} - Token or null if not found
 */
export const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

/**
 * Middleware to authenticate user based on token
 * Attaches user object to req.user if authentication is successful
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req);
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Authorization token required" 
      });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
