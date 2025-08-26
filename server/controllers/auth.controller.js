// controllers/auth.controller.js
import userModel from "../models/user.model.js";
import { sendMail } from "../utils/sendMail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const otpStore = {};         // for sign up
const resetOtpStore = {};    // for password reset

const signJwt = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES_IN || "7d" }
  );
};

// ---------- Signup 
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await userModel.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, name, password, expiresAt: Date.now() + 5 * 60 * 1000 };

    await sendMail(email, otp, "verify");
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const data = otpStore[email];
    if (!data) return res.status(400).json({ message: "OTP not requested or expired" });
    if (data.expiresAt < Date.now()) { delete otpStore[email]; return res.status(400).json({ message: "OTP expired" }); }
    if (data.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const newUser = new userModel({ name: data.name, email, password: data.password });
    await newUser.save();
    delete otpStore[email];

    const token = signJwt(newUser);
    return res.status(201).json({ message: "User registered successfully", token, user: { id:newUser._id, name:newUser.name, email:newUser.email } });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// ---------- Email/Password Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signJwt(user);
    return res.status(200).json({ message: "Login successful", token, user: { id:user._id, name:user.name, email:user.email } });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// ---------- Forgot Password: Send OTP
export const forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found with this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    resetOtpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    await sendMail(email, otp, "reset");
    return res.status(200).json({ message: "Password reset OTP sent" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// ---------- Forgot Password: Verify OTP
export const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const data = resetOtpStore[email];
    if (!data) return res.status(400).json({ message: "OTP not requested or expired" });
    if (data.expiresAt < Date.now()) { delete resetOtpStore[email]; return res.status(400).json({ message: "OTP expired" }); }
    if (data.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    // mark verified for reset (you could set a short-lived token as well)
    data.verified = true;
    return res.status(200).json({ message: "OTP verified. You may now reset your password." });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// ---------- Forgot Password: Reset
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const data = resetOtpStore[email];
    if (!data || !data.verified) return res.status(400).json({ message: "OTP verification required" });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // set new password (pre-save hook will hash)
    user.password = newPassword;
    await user.save();

    delete resetOtpStore[email];
    return res.status(200).json({ message: "Password reset successful" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
