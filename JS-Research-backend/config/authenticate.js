import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { userRoles } from '../utils/helper.js';

dotenv.config();

const userSecretKey = process.env.USER_SECRET_KEY;
const inviteSecretKey = process.env.INVITE_SECRET_KEY;
const passwordSecretKey = process.env.PASSWORD_CHANGE_SECRET_KEY;
const emailSecretKey = process.env.EMAIL_CHANGE_SECRET_KEY;
/**
 * Generates a JWT token for a user.
 * @param {Object} user - The user object containing user data.
 * @returns {string} - The JWT token.
 */
export const getUserToken = async (user) => {
  try {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, userSecretKey, {
      expiresIn: 1800, // Set the expiration time for the token to 1800 seconds (30 minutes)
    });
  } catch (err) {
    return err?.message;
  }
};

/**
 * Generates a JWT token for an invite.
 * @param {Object} user - The user object containing invite data.
 * @returns {string} - The JWT token.
 */
export const getInviteToken = (user) => {
  try {
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isApproved: true,
      isVerified: true,
      otp: null,
    };
    return jwt.sign(payload, inviteSecretKey, {
      expiresIn: 3600, // Set the expiration time for the token to 3600 seconds (60 minutes or 1 hour)
    });
  } catch (err) {
    return err?.message;
  }
};

export const getEmailUpdateToken = (user) => {
  try {
    const payload = {
      id: user.id,
      oldEmail: user.oldEmail,
      newEmail: user.newEmail,
    };
    return jwt.sign(payload, emailSecretKey, {
      expiresIn: 900, // 15 minutes in seconds
    });
  } catch (err) {
    return err?.message;
  }
};

export const verifyEmailUpdateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: 'No token provided.' });
    }

    // Verify and decode the token
    const decoded = await jwt.verify(token.split('Bearer ')[1], emailSecretKey);

    // Attach the decoded payload to the request object
    req.user = decoded;
    if (decoded) await next();
  } catch (err) {
    return res.status(401).json({ status: false, message: 'Unauthorized' });
  }
};
export const getUpdatePasswordToken = (user) => {
  try {
    const payload = {
      email: user.email,
    };
    return jwt.sign(payload, passwordSecretKey, {
      expiresIn: 3600, // Set the expiration time for the token to 3600 seconds (60 minutes or 1 hour)
    });
  } catch (err) {
    return err?.message;
  }
};

/**
 * Verifies the invite token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
export const verifyInviteToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: 'No token provided.' });
    }

    // Verify and decode the token
    const decoded = await jwt.verify(
      token.split('Bearer ')[1],
      inviteSecretKey
    );

    // Attach the decoded payload to the request object
    req.user = decoded;
    if (decoded) await next();
  } catch (err) {
    return res.status(401).json({ status: false, message: 'Unauthorized' });
  }
};

/**
 * Verifies the invitePassword token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
export const verifyEmailPasswordToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: 'No token provided.' });
    }

    // Verify and decode the token
    const decoded = await jwt.verify(
      token.split('Bearer ')[1],
      passwordSecretKey
    );

    // Attach the decoded payload to the request object
    req.user = decoded;
    if (decoded) await next();
  } catch (err) {
    return res.status(401).json({ status: false, message: 'Unauthorized' });
  }
};

export const verifyUserToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: 'No token provided.' });
    }
    const authen = async () => {
      if (!req.isAuthenticated) {
        const token = req.headers.authorization;
        await jwt.verify(
          token.split('Bearer ')[1],
          userSecretKey,
          async (err, decoded) => {
            if (!err) {
              const user = await User.findOne({ email: decoded.email });
              if (user && user.role === userRoles.User && user.isApproved) {
                req.isAuthenticated = true;
                req.user = user;
              }
            }
          }
        );
      }
    };
    await authen();
    await next();
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err?.message,
    });
  }
};

export const withoutToken = async (req, res, next) => {
  try {
    await next();
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err?.message,
    });
  }
};

export const verifyAdminToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: 'No token provided.' });
    }
    const authen = async () => {
      if (!req.isAuthenticated) {
        const token = req.headers.authorization;
        await jwt.verify(
          token.split('Bearer ')[1],
          userSecretKey,
          async (err, decoded) => {
            if (!err) {
              const user = await User.findOne({ email: decoded.email });
              if (user && user.role === userRoles.Admin) {
                req.isAuthenticated = true;
                req.user = user;
              }
            }
          }
        );
      }
    };
    await authen();
    await next();
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err?.message,
    });
  }
};

export const verifyAdminTokenCreateResearchPaper = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next();
    }
    await jwt.verify(
      token.split('Bearer ')[1],
      userSecretKey,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            status: false,
            message: err.message,
          });
        }
        const user = await User.findOne({ email: decoded.email });
        if (user && user.role === userRoles.Admin) {
          req.isAuthenticated = true;
          req.user = user;
        }
      }
    );
    await next();
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err?.message,
    });
  }
};

export const verifyUserTokenCreateResearchPaper = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next();
    }
    await jwt.verify(
      token.split('Bearer ')[1],
      userSecretKey,
      async (err, decoded) => {
        if (!err) {
          const user = await User.findOne({ email: decoded.email });
          if (user && user.role === userRoles.User) {
            req.isAuthenticated = true;
            req.user = user;
          }
        }
      }
    );
    await next();
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err?.message,
    });
  }
};

/**
 * Middleware to handle invalid token cases.
 */
export const invalidtoken = async (req, res, next) => {
  try {
    if (!req.isAuthenticated) {
      return res.status(401).json({
        status: false,
        message: 'unauthorized',
      });
    }
    await next();
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err?.message,
    });
  }
};

export const usernAuthCheck = [verifyUserToken, invalidtoken];

export const userAndAdminAuthenticationCheck = [
  verifyAdminToken,
  verifyUserToken,
  invalidtoken,
];
export const AdminAuthenticationCheck = [verifyAdminToken, invalidtoken];
export const invitationAuthCheck = [verifyInviteToken, invalidtoken];
export const getUpdatePasswordAuthCheck = [
  getUpdatePasswordToken,
  invalidtoken,
];
export const getUpdateEmailAuthCheck = [getEmailUpdateToken, invalidtoken];

export const userAndAdminAuthenticationCheckCreateResearchPaper = [
  verifyAdminTokenCreateResearchPaper,
  verifyUserTokenCreateResearchPaper,
];
