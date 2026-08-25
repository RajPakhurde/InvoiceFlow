import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

export const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendInvoiceEmail = async ({ to, subject, text, pdfBuffer, filename }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    const error = new Error('SMTP credentials are not configured in environment variables');
    error.status = 500;
    error.code = 'SMTP_CONFIG_ERROR';
    throw error;
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"InvoiceFlow" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    attachments: [
      {
        filename: filename || 'invoice.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  return await transporter.sendMail(mailOptions);
};
