import express from "express";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import {
  login,
  register,
  verifyOtp,
  forgotPasswordSendOtp,
  verifyForgotOtp,
  resetPassword
} "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import passport from "./config/passport.js";
import cors from "cors";

connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
  })
);
app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
