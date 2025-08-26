import express from "express";
import passport from "../config/passport.js";
import { login, register } from "../controllers/auth.controller.js";

const router = express.Router();

// Email/Password login
router.post("/login", login);
router.post("/register", register);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const { token, user } = req.user;
    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  }
);

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const { token, user } = req.user;
    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  }
);

export default router;
