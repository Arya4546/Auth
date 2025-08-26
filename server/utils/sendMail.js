// utils/sendMail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,      
    pass: process.env.PASSWORD    
  }
});

/**
 * Send OTP Email
 * @param {string} mail - Recipient email
 * @param {string} otp - OTP code
 * @param {string} purpose - "verify" for signup, "reset" for password reset
 */
export const sendMail = async (mail, otp, purpose = "verify") => {
  const title =
    purpose === "reset" ? "Password Reset OTP" : "Email Verification OTP";
  const subtitle =
    purpose === "reset"
      ? "Use this OTP to reset your password."
      : "Use this OTP to complete your sign up.";


  const html = `
  <div style="font-family:Inter,Arial;padding:24px;background:#0b0f19;color:#e5e7eb">
    <div style="max-width:560px;margin:auto;background:#111827;border-radius:14px;padding:28px">
      <h2 style="margin:0 0 6px;font-size:22px;color:#fff">${title}</h2>
      <p style="margin:0 0 18px;color:#9ca3af">${subtitle} The OTP expires in <b>5 minutes</b>.</p>
      <div style="text-align:center;margin:20px 0">
        <span style="letter-spacing:6px;font-size:32px;background:#1f2937;border-radius:10px;padding:12px 20px;display:inline-block;color:#fff">
          ${otp}
        </span>
      </div>
      <p style="color:#9ca3af">If you didn’t request this, you can ignore this email.</p>
    </div>
  </div>`;

  // Send mail
  return transporter.sendMail({
    from: `"Auth System" <${process.env.EMAIL}>`,
    to: mail,
    subject: title,
    html
  });
};
