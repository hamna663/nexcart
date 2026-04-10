import nodemailer from "nodemailer";

// Create a transporter using SMTP
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"), // default to 587 if not set
  secure: process.env.SMTP_SECURE === "true", // use STARTTLS (upgrade connection to TLS after connecting)
  service: process.env.SMTP_SERVICE, // e.g., 'Gmail'",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
