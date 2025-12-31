import nodemailer from 'nodemailer';

export const createTransporter = () => {
  // NOTE: For Gmail, use an 'App Password' if 2FA is enabled.
  return nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};