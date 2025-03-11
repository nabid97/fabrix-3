import nodemailer from 'nodemailer';
import config from './index';

/**
 * Email configuration and transport setup
 * Uses nodemailer to create a reusable mail transport
 */

// Create reusable transporter object using SMTP transport
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password',
  },
});

// For development/testing purposes, you can use a test account
if (process.env.NODE_ENV !== 'production') {
  // Log transport ready status
  transporter.verify((error) => {
    if (error) {
      console.log('SMTP server connection error:', error);
    } else {
      console.log('SMTP server is ready to send messages');
    }
  });
}

// Verify the config index.ts file has the necessary email configuration
if (!config.email) {
  console.warn('Warning: Email configuration missing in config/index.ts');
}