import sendEmail from "./sendEmail.js";

export const sendVerifyEmail = async (email, userName, otpCode) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #fafafa;">
      <h2 style="color: #3b82f6;">Verify Your Email</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>Thank you for signing up to InstaClone. Use the code below to verify your email:</p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; margin: 16px 0;">${otpCode}</div>
      <p>This code will expire in 5 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: String(email).trim(),
    subject: "Verify Your Email - InstaClone",
    html,
  });
};
