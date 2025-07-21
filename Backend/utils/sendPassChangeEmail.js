import sendEmail from "./sendEmail.js";


export const sendPassChangeEmail = async (user) => {
  if (!user?.email || !user?.userName) {
    throw new Error("Invalid user object in sendPassChangeEmail");
  }

  const frontendUrl =
    process.env.NODE_ENV === "production"
      ? "https://insta-clone27.vercel.app"
      : "http://localhost:5173";

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: auto; background-color: #fafafa;">
      <h2 style="color: #dc2626;">Your InstaClone password was changed</h2>
      <p>Hi <strong>${user.userName}</strong>,</p>
      <p>We wanted to let you know that your password was successfully changed.</p>
      <p>If you did not make this change, <strong>please reset your password immediately</strong> and contact support.</p>
      <a href="${frontendUrl}/forgotPassword" style="margin-top: 20px; display: inline-block; background: #dc2626; color: #fff; padding: 10px 16px; text-decoration: none; border-radius: 6px;">Reset Password</a>
      <p style="margin-top: 30px; font-size: 12px; color: #888;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  await sendEmail({
    to: user.email.trim(),
    subject: "Your InstaClone Password Was Changed",
    html,
  });
};
