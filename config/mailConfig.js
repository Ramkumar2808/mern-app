import nodemailer from "nodemailer";

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER, // e.g., Gmail, Outlook, etc.
  auth: {
    user: process.env.EMAIL_ADMIN_USER,
    pass: process.env.EMAIL_ADMIN_PASSWORD,
  },
});

export default transporter;
