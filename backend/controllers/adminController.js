const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

// ─── RATE LIMITER ─────────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts, try again later" },
});

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 8 * 60 * 60 * 1000,
});

const looksLikeBcryptHash = (value) =>
  typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);

const verifyAdminPassword = async (plainPassword, storedPassword) => {
  if (!plainPassword || !storedPassword) return false;
  if (looksLikeBcryptHash(storedPassword)) {
    return bcrypt.compare(plainPassword, storedPassword);
  }
  return plainPassword === storedPassword;
};

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM admins WHERE username = ? AND is_active = 1",
      [username.trim().toLowerCase()]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const admin = rows[0];
    const isPasswordValid = await verifyAdminPassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    await db.query("UPDATE admins SET last_login = NOW() WHERE id = ?", [admin.id]);

    const token = jwt.sign(
      { id: admin.id, username: admin.username, name: admin.name, role: admin.role, user_type: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.cookie("token", token, cookieOptions());
    res.json({
      message: "Login successful",
      token,
      admin: { id: admin.id, name: admin.name, username: admin.username, role: admin.role },
    });
  } catch (error) {
    console.error("adminLogin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── GET CURRENT ADMIN ────────────────────────────────────────────────────────
const getAdminMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, username, role, last_login FROM admins WHERE id = ? AND is_active = 1",
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Admin not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("getAdminMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const [rows] = await db.query("SELECT password FROM admins WHERE id = ?", [req.user.id]);
    const isCurrentPasswordValid = await verifyAdminPassword(currentPassword, rows[0].password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.query("UPDATE admins SET password = ? WHERE id = ?", [hashedPassword, req.user.id]);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("changePassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── ADD TRAINER ACCOUNT ──────────────────────────────────────────────────────
const addTrainer = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only the gym owner can add trainer accounts" });
    }

    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ message: "Name, username and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const [existing] = await db.query(
      "SELECT id FROM admins WHERE username = ?",
      [username.trim().toLowerCase()]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      "INSERT INTO admins (name, username, password, role) VALUES (?, ?, ?, 'trainer')",
      [name.trim(), username.trim().toLowerCase(), hashedPassword]
    );

    res.status(201).json({ message: "Trainer account created successfully", trainerId: result.insertId });
  } catch (error) {
    console.error("addTrainer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── GET ALL TRAINERS ─────────────────────────────────────────────────────────
const getTrainers = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Owner access required" });
    }

    const [rows] = await db.query(
      "SELECT id, name, username, role, is_active, last_login, created_at FROM admins ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("getTrainers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── TOGGLE TRAINER ACTIVE ────────────────────────────────────────────────────
const toggleTrainer = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Owner access required" });
    }

    const { id } = req.params;
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: "You cannot disable your own account" });
    }

    await db.query("UPDATE admins SET is_active = NOT is_active WHERE id = ?", [id]);
    res.json({ message: "Trainer account status updated" });
  } catch (error) {
    console.error("toggleTrainer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
const adminLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out successfully" });
};

module.exports = { loginLimiter, adminLogin, getAdminMe, changePassword, addTrainer, getTrainers, toggleTrainer, adminLogout };
