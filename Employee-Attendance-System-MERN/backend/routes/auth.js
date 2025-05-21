const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyAdmin, authMiddleware } = require("../middleware/auth");

const router = express.Router();


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // console.log(user);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "8fbd2e4c3f9e4f7a93a9e6f8b1c1d9e3e6a8a2f6d1c9f7e4b3a2d8c7f4e9a1b6",
    { expiresIn: "1d" }
  );
  const { password: _, ...safeUser } = user.toObject();

  res.json({ user: safeUser, token });
});

router.post("/register", async (req, res) => {
  const { name, email, password, role, department } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role, department });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.json({ message: "Server error" });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;

    if (req.user.role === "admin") {
      user.department = req.body.department || user.department;
    }

    await user.save();
    const { password, ...safeUser } = user.toObject();
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

module.exports = router;
