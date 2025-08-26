import express from "express";
import upload from "../middleware/upload.js";
import userModel from "../models/user.model.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = express.Router();


router.post("/upload-profile-pic/:id", upload.single("profilePic"), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndUpdate(
      id,
      { profilePic: req.file.path }, 
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile picture updated", profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
});

// Get Profile Pic
router.get("/profile-pic/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user }); 
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;