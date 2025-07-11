// import sendEmail from "./sendEmail.js";

// export const sendWelcomeEmail = async (user) => {
//   if (!user || !user.email || !user.userName) {
//     throw new Error("Missing user info for welcome email.");
//     return;
//   }

//   const html = `
//     <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: auto;">
//       <h2 style="color: #262626;">Welcome to InstaClone,</h2>
//       <p>Hi ${user.userName},</p>
//       <p>We're excited to have you on board. Your email has been successfully verified.</p>
//       <p>Start exploring, posting and connecting now!</p>
//     </div>
//   `;

//   await sendEmail({
//     to: user.email.trim(),
//     subject: "Welcome to InstaClone!🎉",
//     html,
//   });
// };

import sendEmail from "./sendEmail.js";

export const sendWelcomeEmail = async (user) => {
  if (!user?.email || !user?.userName) {
    throw new Error("Missing user info for welcome email.");
  }

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: auto; background-color: #fafafa;">
      <h2 style="color: #262626;">Welcome to <span style="color: #3b82f6;">InstaClone</span> 🎉</h2>
      <p>Hi <strong>${user.userName}</strong>,</p>
      <p>We're excited to have you on board. Your email has been successfully verified.</p>
      <p>Start exploring, posting, and connecting now!</p>
      <a href="https://your-app-url.com" style="margin-top: 20px; display: inline-block; background: #3b82f6; color: #fff; padding: 10px 16px; text-decoration: none; border-radius: 6px;">Go to InstaClone</a>
      <p style="margin-top: 30px; font-size: 12px; color: #888;">If you did not create this account, you can safely ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: user.email.trim(),
    subject: "Welcome to InstaClone! 🎉",
    html,
  });
};
