import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

// Helper → issue JWT
const signJwt = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 🔹 Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await userModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "google-oauth", // dummy password
            profilePic: profile.photos?.[0]?.value || "",
          });
        }

        const token = signJwt(user);
        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// 🔹 GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value || profile.username + "@github.com";

        let user = await userModel.findOne({ email });

        if (!user) {
          user = await userModel.create({
            name: profile.displayName || profile.username,
            email,
            password: "github-oauth", // dummy password
            profilePic: profile.photos?.[0]?.value || "",
          });
        }

        const token = signJwt(user);
        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);


export default passport;
