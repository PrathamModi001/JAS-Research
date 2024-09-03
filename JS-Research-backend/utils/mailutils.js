import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { researchPaperCreatedEmail } from './Emails/researchPaperCreatedEmail.js';
import { JASOTPEmail } from './Emails/JAS-OTP-Email.js';
// import { JASVerifyEmail } from './Emails/JAS-Verify-Email.js';
import { JASInviteEmail } from './Emails/JAS-Email-Invite.js';
import { researchPaperEditEmail } from './Emails/researchPaperEditEmail.js';
import { researchPaperApprovedEmail } from './Emails/researchPaperApprovedEmail.js';
import { rejectionEmail } from './Emails/rejectionEmail.js';
import path from 'path'; import { fileURLToPath } from 'url';
import { forgotPasswordEmail } from './Emails/forgotPasswordEmail.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const  imagePath = path.join(__dirname, 'JAS-logo.png');

const bgColor = "#faebd7" // #036a85

dotenv.config();

const transporter = nodemailer.createTransport({
  sendMail: true,
  host: process.env.SMTP_HOST,
  secure: true,
  port: process.env.SMTP_PORT,
  auth: {
    user: `${process.env.SMTP_MAIL}`,
    pass: `${process.env.SMTP_PASSWORD}`,
  },
});

const sendMail = async (mailObject) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: mailObject.to,
    subject: mailObject.subject,
    text: mailObject.text,
    html: mailObject.html,
  };

  try {
    await transporter.sendMail(mailOptions, (err, res) => res);
  } catch (err) {
    console.log('Error ::', err?.message);
    return err;
  }
};

export const wrapedAsyncSendMail = (mailOptions) =>
  new Promise((resolve) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`error is ${error}`);
        resolve(false);
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve(true);
      }
    });
  });

export const emailOTP = async (email, otp, firstName) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Your Verification OTP to JAS-Research',
    text: 'This is a test message, Thanks for Registering on JAS-Research.',
    attachments: [
      {
        fileName: `JAS-logo.png`,
        path: imagePath,
        cid: 'unique@kreata.ee', //same cid value as in the html img src
      }
    ],
    html: JASOTPEmail(firstName, otp, bgColor),
  };
  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
};

export const mailUserForgotPasswordOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Your Forgot Password Request Verification OTP to JAS-Research',
    text: 'This is a test message,Please enter the given otp to reset your user password.',
    attachments: [
      {
        fileName: `JAS-logo.png`,
        path: imagePath,
        cid: 'unique@kreata.ee', //same cid value as in the html img src
      }
    ],
    html: JASOTPEmail(otp, bgColor),
  };

  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
};

export const mailSuccessfullyRegisterUser = (userDetails) => {
  const mailObject = {
    email: userDetails.email,
    subject: `Welcome ${userDetails.firstname}  ${userDetails.lastname} to JAS-Research`,
    text: 'Thanks for Registering on JAS-Research.',
    html: `Welcome ${userDetails.firstname}  ${userDetails.lastname} to JAS-Research`,
  };

  sendMail(mailObject);
};

export const sendEmailUpdateRequest = async (email, url, firstName) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Forgotten Password Request',
    text: 'This is a test message, Thanks for Update Email on JAS-Research.',
    attachments: [
      {
        fileName: `JAS-logo.png`,
        path: imagePath,
        cid: 'unique@kreata.ee', //same cid value as in the html img src
      }
    ],
    html: forgotPasswordEmail(url, bgColor, firstName),
  };

  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
};

export const rejection = async (email, title, reasonOfRejection) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Research Paper Rejected',
    text: 'Dear recipient,\n\nThis is to inform you that the research paper has been rejected.\n\nBest regards,\n[Your Name]', // Adjust the sender's name accordingly
    attachments: [
      {
        fileName: `JAS-logo.png`,
        path: imagePath,
        cid: 'unique@kreata.ee', //same cid value as in the html img src
      }
    ],
    html: rejectionEmail(title, reasonOfRejection),
  };
  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
}

export const researchPaperApproved = async (email, title) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Research Paper Approved',
    text: 'Dear recipient,\n\nThis is to inform you that the research paper has been approved.\n\nBest regards,\n[Your Name]', // Adjust the sender's name accordingly
    attachments: [
      {
        fileName: `JAS-logo.png`,
        path: imagePath,
        cid: 'unique@kreata.ee', //same cid value as in the html img src
      }
    ],
    html: researchPaperApprovedEmail(title),
  };
  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
}

export const inviteMail = async (inviteDetails) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: inviteDetails.email,
    subject: `Invitation to JAS`,
    attachments: [
      {
        fileName: `JAS-logo.png`,
        path: imagePath,
        cid: 'unique@kreata.ee', //same cid value as in the html img src
      }
    ],
    html: JASInviteEmail(inviteDetails.userName, inviteDetails.inviterName, bgColor),
  };
  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
};

export const pendingResearchPaper = async () => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: 'vivek.cilans@gmail.com',
    subject: 'Pending Approved Research Paper Uploaded Successfully',
    text: 'Dear recipient,\n\nThis is to inform you that the pending approved research paper has been successfully uploaded.\n\nBest regards,\n[Your Name]', // Adjust the sender's name accordingly
    html: `<html></html>`,
  };
  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
};

export const researchPaperCreated = async (email, firstName) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Research Paper Created Successfully',
    text: `Dear recipient,\n\nThis is to inform you that the research paper has been created successfully.\n\nBest regards,\n${firstName}`, // Adjust the sender's name accordingly
    attachments: [
      {
        fileName: `JAS-logo.png`,
        path: imagePath,
        cid: 'unique@kreata.ee', //same cid value as in the html img src
      }
    ],
    html: researchPaperCreatedEmail(firstName, bgColor),
  };
  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
}

export const researchPaperEdit = async (email, title) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Research Paper Edited Successfully',
    text: 'Dear recipient,\n\nThis is to inform you that the research paper has been edited successfully.\n\nBest regards,\n[Your Name]', // Adjust the sender's name accordingly
    attachments: [
      {
        fileName: `JAS-logo.png`,
        path: imagePath,
        cid: 'unique@kreata.ee', //same cid value as in the html img src
      }
    ],
    html: researchPaperEditEmail(title),
  };
  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
}

export const userApprovedEmail = async (email, firstName) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'User Approved Successfully',
    text: `Dear recipient,\n\nThis is to inform you that the user has been approved successfully.\n\nBest regards,\n${firstName}`, // Adjust the sender's name accordingly
    attachments: [
      {
        fileName: `JAS-logo.png`,
        path: imagePath,
        cid: 'unique@kreata.ee', //same cid value as in the html img src
      }
    ],
    // html: userApprovedEmailSend(firstName, firstName),
    html: `<html>APPROVED</html>`,
  };
  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
}

export const userDisApprovedEmail = async (email, firstName) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'User Dis-Approved Successfully',
    text: `Dear recipient,\n\nThis is to inform you that the user has been dis-approved successfully.\n\nBest regards,\n${firstName}`, // Adjust the sender's name accordingly
    attachments: [
      {
        fileName: `JAS-logo.png`,
        path: imagePath,
        cid: 'unique@kreata.ee',
      }
    ],
    // html: userDisApprovedEmailSend(firstName, firstName),
    html: `<html>DIS-APPROVED</html>`,
  };
  const resp = await wrapedAsyncSendMail(mailOptions);
  return resp;
}