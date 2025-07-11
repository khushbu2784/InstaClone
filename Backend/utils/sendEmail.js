import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  if (!to || !subject || !html) {
    throw new Error("Missing required fields for sending email.");
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail", // or your provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"InstaClone" <${process.env.EMAIL_USER}>`,
    to: to.trim(),
    subject,
    html,
  });
};

export default sendEmail;
