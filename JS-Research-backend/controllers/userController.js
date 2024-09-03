import User from '../models/User.js';
import { validationResult } from 'express-validator';
import {
  emailOTP,
  inviteMail,
  mailUserForgotPasswordOTP,
  sendEmailUpdateRequest,
  userApprovedEmail,
  userDisApprovedEmail,
} from '../utils/mailutils.js';
import { otpGenerate, userRoles } from '../utils/helper.js';
import bcrypt from 'bcrypt';
import {
  getEmailUpdateToken,
  getInviteToken,
  getUpdatePasswordToken,
  getUserToken,
} from '../config/authenticate.js';

import csv from 'csvtojson';

export const userController = {
  registerUser: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ status: false, message: errors.errors[0].msg });
        }
        const hashPassword = await bcrypt.hash(`${req.body.password}`, 10);
        req.body.password = hashPassword;
        const otp = await otpGenerate();
        const otpExpiry = new Date(new Date().getTime() + 10 * 60 * 1000);
        const currentUser = { ...req.body, otp, otpExpiry };

        const checkUser = await User.findOne({ email: currentUser.email });

        if (checkUser) {
          if (checkUser.isVerified) {
            return res.status(400).json({
              status: false,
              message: 'Email already registered.',
            });
          } else {
            const updateOtp = await User.updateOne(
              { _id: checkUser.id },
              { $set: currentUser }
            );
            if (!updateOtp) {
              return res.status(400).json({
                status: false,
                message: 'Failed to update OTP.',
              });
            } 
            const otpSent = await emailOTP(checkUser.email, otp, checkUser.firstName);
            if (!otpSent) {
              return res
                .status(400)
                .json({ status: false, message: 'Failed to send OTP' });
            }
            if (!otpSent) {
              return res.status(400).json({
                status: false,
                message: 'Invalid Email Address',
              });
            }
            return res.status(200).json({
              status: true,
              message:
                'User registered successfully, Please check your email for OTP.',
            });
          }
        }

        if (currentUser.role === userRoles.Admin) {
          const passkey = req.headers['x-passkey'];
          if (!passkey || passkey !== process.env.PASSKEY) {
            return res
              .status(400)
              .json({ status: false, message: 'Failed to create superAdmin.' });
          }
          currentUser.isApproved = true;
        }

        const newUser = new User(currentUser);
        const otpSent = await emailOTP(currentUser.email, otp);
        if (!otpSent) {
          return res
            .status(400)
            .json({ status: false, message: 'Failed to send OTP' });
        }

        const user = await newUser.save();
        if (!user) {
          return res
            .status(400)
            .json({ status: false, message: 'Failed to register user' });
        }

        return res.status(200).json({
          status: true,
          message:
            'User registered successfully, Please check your email for OTP.',
        });
      } catch (err) {
        console.log(err.message);
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  verifyEmail: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ status: false, message: errors.errors[0].msg });
        }

        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
          return res
          .status(400)
          .json({ status: false, message: 'User does not exist.' });
        }

        const otpExpiryTimeForUser = user.otpExpiry;
        if (user.isVerified) {
          return res
            .status(400)
            .json({ status: false, message: 'User is already verified.' });
        }

        if (user.otp !== otp) {
          return res
            .status(400)
            .json({ status: false, message: 'Invalid OTP.' });
        }
        if (new Date() > otpExpiryTimeForUser) {
          return res
            .status(400)
            .json({ status: false, message: 'OTP has expired.' });
        }

        await User.updateOne(
          { _id: user.id },
          { $set: { otp: null, isVerified: true } }
        );

        return res
          .status(200)
          .json({ status: true, message: 'Email verified successfully.' });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],

  /**
   * Enhanced controller method for user authentication and login.
   * Validates request, checks email existence, verifies password, generates token,
   * and for organization admin, checks account approval and updates OTP status if applicable.
   * Returns tailored success or error responses.
   */
  loginUser: [
    async (req, res) => {
      try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          return res.status(400).json({
            status: false,
            message: 'Invalid Id & Password',
          });
        }
        if (!user.isVerified) {
          return res.status(400).json({
            status: false,
            message: 'Email address is not verified!!',
          });
        }

        if (!user.isApproved) {
          return res.status(400).json({
            status: false,
            message: 'Account not yet approved, Kindly contact admin !!',
          });
        }
        // Check if password is valid
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!validPassword) {
          return res.status(400).json({
            status: false,
            message: 'Invalid Id & Password',
          });
        }

        // Update OTP status if applicable
        const otpCheck = await User.findById(user.id);
        if (otpCheck.otp) {
          await User.updateOne(
            { _id: user.id },
            { $set: { otp: null, isVerified: true } }
          );
        }
        // Generate token for user
        const token = await getUserToken(user);
        return res.status(200).json({
          status: true,
          message: 'login successful.',
          data: { token },
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],

  /**
   * Controller method to get user details.
   * Retrieves details of the authenticated user.
   * Sends a response containing the user details or an error message if any.
   */
  me: [
    async (req, res) => {
      try {
        res.status(200).json({
          status: true,
          data: { user: req.user },
        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  updateUser: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }

        const userId = req.user.id;
        const userDetails = req.body;

        const updateUser = await User.findOneAndUpdate(
          { _id: userId },
          userDetails,
          { new: true }
        );

        if (updateUser) {
          return res.status(200).json({
            status: true,
            message: 'User updated successfully!',
          });
        } else {
          return res.status(404).json({
            status: false,
            message: 'User not found', // Handle case when user is not found
          });
        }
      } catch (err) {
        return res.status(500).json({
          status: false,
          message: err.message || 'Internal Server Error',
        });
      }
    },
  ],

  getUserList: [
    async (req, res) => {
      try {
        const isApproved =
          req?.query?.isApproved === 'true' || req.query.isApproved === '1';
        const pageNo = parseInt(req.query.pageNo, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const queryfilter = req.query.query || '';
  
        const query = { isVerified: true }; // Ensuring only verified users are included
  
        if (typeof isApproved === 'boolean') {
          query.isApproved = isApproved;
        }
        if (queryfilter) {
          query.$or = [
            { firstName: { $regex: new RegExp(queryfilter, 'i') } },
            { lastName: { $regex: new RegExp(queryfilter, 'i') } },
            { email: { $regex: new RegExp(queryfilter, 'i') } },
          ];
        }
  
        const count = await User.countDocuments(query);
        const users = await User.find(query)
          .select('-password -otp -updatedAt -createdAt') // Excluding sensitive fields
          .skip((pageNo - 1) * limit)
          .limit(limit);
  
        const onlyUsers = users.filter((user) => user.role !== userRoles.Admin);
        return res.status(200).json({
          status: true,
          data: {
            list: onlyUsers,
            total: count,
            next: count > (pageNo - 1) * limit + limit,
          },
        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  
  getUser: [
    async (req, res) => {
      try {
        const userId = req.params.id; // Extract user ID from request parameters

        // Fetch user by ID
        const user = await User.findById(userId).select(
          '-password -otp -updatedAt -createdAt'
        );

        // Check if user exists
        if (!user) {
          return res
            .status(404)
            .json({ status: false, error: 'User not found' });
        }

        // User found, return user data
        return res.status(200).json({
          status: true,
          user: user,
        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  updateByAdmin: [
    async (req, res) => {
      try {
        const userId = req.params.id; // Extract user ID from request parameters
        const updates = req.body; // Extract updates from request body

        // Perform validation of the updates using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res
            .status(400)
            .json({ status: false, errors: errors.errors[0].msg });
        }

        const userFromDb = await User.findById(userId);
        const isApprovedNow = updates.isApproved && !userFromDb.isApproved;
        console.log(isApprovedNow);
        if(isApprovedNow){
          const emailSend = await userApprovedEmail(userFromDb.email, userFromDb.firstName);
          if (!emailSend) {
            return res.status(400).json({
              status: false,
              message: 'Failed to send email',
            });
          }
        }

      const disApprovedNow = !updates.isApproved && userFromDb.isApproved;
      if(disApprovedNow){
        const emailSend = await userDisApprovedEmail(userFromDb.email, userFromDb.firstName);
        if (!emailSend) {
          return res.status(400).json({
            status: false,
            message: 'Failed to send email',
          });
        }
      } 


        // Find user by ID and update
        const user = await User.findByIdAndUpdate(userId, updates, {
          new: true,
        });

        // Check if user exists
        if (!user) {
          return res
            .status(404)
            .json({ status: false, error: 'User not found' });
        }

        // User updated successfully, return updated user data
        return res.status(200).json({
          status: true,
          message: 'User updated successfully',
          user: user,
        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  removeUser: [
    async (req, res) => {
      try {
        const userId = req.params.id;
        const deleteUser = await User.deleteOne({ _id: userId });
        if (deleteUser.deletedCount === 0) {
          return res
            .status(404)
            .json({ status: false, error: 'User not found' });
        }

        // User updated successfully, return updated user data
        return res.status(200).json({
          status: true,
          message: 'User delete successfully',
        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  forgotPassword: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }
        const email = req.body?.email;
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({
            status: false,
            message: 'User does not exists',
          });
        }

        const otp = await otpGenerate();
        const otpSent = await mailUserForgotPasswordOTP(email, otp);
        if (!otpSent) {
          return res.status(400).json({
            status: false,
            message: 'Invalid email',
          });
        }

        const setOtp = await User.updateOne(
          { _id: user.id },
          { $set: { otp: otp } }
        );
        if (!setOtp) {
          return res.status(400).json({
            status: false,
            message: 'Something Went Wrong!!',
          });
        }
        return res.status(200).json({
          status: true,
          message: 'OTP sent to email address.',
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  /**
   * Controller method to update password after forgetting it.
   * Validates the provided email and OTP, then updates the user's password.
   * Sends appropriate error responses for invalid input or if the OTP verification fails.
   */
  updatePassword: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }

        const { newPassword, oldPassword } = req.body;

        const validPassword = await bcrypt.compare(
          oldPassword,
          req.user.password
        );
        if (!validPassword) {
          return res.status(400).json({
            status: false,
            message: 'Invalid Current password',
          });
        }
        await bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPassword, salt, async (err, hash) => {
            const userPayload = {
              password: hash,
            };
            const updatePassword = await User.updateOne(
              { _id: req.user.id },
              { $set: userPayload }
            );
            if (!updatePassword) {
              return res.status(400).json({
                status: false,
                message: 'Something went wrong!!',
              });
            }
            return res.status(200).json({
              status: true,
              message: 'Password updated successfully!!',
            });
          });
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  bulkUploadUser: [
    async (req, res) => {
      try {
        const jsonArray = await csv().fromFile(req.file.path);

        for (const item of jsonArray) {
          // const userData = {
          //   firstName: item.firstName,
          //   lastName: item.lastName,
          //   email: item.email,
          //   role: item.role,
          // };

          // Generate invitation token
          const inviteToken = getInviteToken(item);

          // Prepare email details
          const emailDetails = {
            inviterName: `${req.user.firstName} ${req.user.lastName}`,
            userName: `${item.firstName} ${item.lastName}`,
            email: item.email,
            inviteToken: inviteToken,
          };

          // Send invitation email
          const inviteSent = inviteMail(emailDetails);

          // Handle email sending failure
          if (!inviteSent) {
            return res.status(400).json({
              status: false,
              message: 'Failed to send invitation email.',
            });
          }
        }

        res.status(200).json({
          status: true,
          message: 'Users uploaded successfully',
        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  invitee: [
    async (req, res) => {
      try {
        const { password } = req.body;
        const currentUser = req.user;
        const checkEmail = await User.findOne({ email: currentUser.email });
        if (checkEmail) {
          return res
            .status(400)
            .json({ status: false, message: 'User already exist.' });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        currentUser.password = hashPassword;
        const newUser = new User(currentUser);
        const user = await newUser.save();

        if (!user) {
          return res
            .status(400)
            .json({ status: false, message: 'Failed to register user' });
        }
        return res.status(200).json({
          status: true,
          message: 'User registered successfully!!.',
        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  updatePasswordByEmail: [
    async (req, res) => {
      try {
        const { email } = req.body;
        const checkEmail = await User.findOne({ email: email });
        if (!checkEmail) {
          return res
            .status(400)
            .json({ status: false, message: 'User not exist.' });
        }

        const passwordUpdatePayload = {
          id: checkEmail.id,
          email: email,
        };
        const passwordToken = await getUpdatePasswordToken(
          passwordUpdatePayload
        );
        const url = `${process.env.PASSWORD_LINK}?${passwordToken}`;
        const emailSent = await sendEmailUpdateRequest(email, url, checkEmail.firstName);
        if (emailSent) {
          return res.status(200).json({
            success: true,
            message: 'Check your email for the update confirmation!',
          });
        }
      } catch (err) {
        res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  verifiedChangePasswordByEmail: [
    async (req, res) => {
      try {
        const { password } = req.body;
        const currentUser = req.user;
        const checkEmail = await User.findOne({ email: currentUser.email });
        if (!checkEmail) {
          return res
            .status(400)
            .json({ status: false, message: 'User not exist.' });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const updateUserPassword = await User.updateOne(
          { _id: checkEmail.id },
          { $set: { password: hashPassword } }
        );

        if (!updateUserPassword) {
          return res
            .status(400)
            .json({ status: false, message: 'Failed to update password' });
        }
        return res.status(200).json({
          status: true,
          message: 'Update password successfully!!.',
        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  updateEmail: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }

        const { newEmail } = req.body;
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Email already exists',
          });
        }
        const emailUpdatePayload = {
          id: req.user.id,
          oldEmail: req.user.email,
          newEmail: newEmail,
        };
        const emailToken = await getEmailUpdateToken(emailUpdatePayload);
        const url = `${process.env.UPDATE_LINK}?${emailToken}`;
        const emailSent = await sendEmailUpdateRequest(newEmail, url);
        if (emailSent) {
          return res.status(200).json({
            success: true,
            message: 'Check your email for the update confirmation!',
          });
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: err?.message,
        });
      }
    },
  ],
  verifiedChangeEmail: [
    async (req, res) => {
      try {
        const { id, newEmail } = req.user;
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Email already updated!!',
          });
        }
        const updateEmail = await User.updateOne(
          { _id: id },
          { $set: { email: newEmail } }
        );
        if (updateEmail) {
          return res.status(200).json({
            status: true,
            message:
              'Your email has been updated successfully. Please login with your new email.',
          });
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: err?.message,
        });
      }
    },
  ],
};
