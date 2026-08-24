const express = require("express");
const { register, login, getMe } = require("../controllers/auth.controller");
// Changed 'authenticateUser' to 'protect' to match auth.middleware.js export
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// POST /api/auth/register — STUDENT self-registration only
router.post("/register", register);

// POST /api/auth/login — STUDENT, WORKER, and ADMIN login
router.post("/login", login);

// GET /api/auth/me — any authenticated user
router.get("/me", protect, getMe);

module.exports = router;