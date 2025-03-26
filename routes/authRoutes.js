const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // ✅ Ensure correct import
// const bcrypt = require("bcryptjs");
const config = require("../config/staging.json");

const router = express.Router();

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("fullName email");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// 🟢 REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create & save user (password is hashed in pre-save hook)
    const user = new User({ fullName, username, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ token, user: { _id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔵 LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { _id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟡 UPDATE USER
router.put("/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    // console.log("PUT request received for ID:", req.params.id);
    // console.log("User:", user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { fullName, email, password } = req.body;

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;

    // Hash new password only if changed
    if (password) {
      user.password = password; 
    }

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
