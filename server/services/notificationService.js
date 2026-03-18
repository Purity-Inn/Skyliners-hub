const nodemailer = require("nodemailer");
const User = require("../models/User");

const getTransporter = () => {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === "true" || Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const getMemberEmails = async () => {
  const users = await User.find({ role: { $in: ["member", "admin"] } }).select("email");
  return users.map((user) => user.email).filter(Boolean);
};

const notifyMembers = async ({ subject, text, html }) => {
  try {
    const transporter = getTransporter();
    if (!transporter) return;

    const recipients = await getMemberEmails();
    if (recipients.length === 0) return;

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.MAIL_FROM || process.env.SMTP_USER,
      bcc: recipients,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.warn("[notifyMembers]", error.message);
  }
};

module.exports = { notifyMembers };
