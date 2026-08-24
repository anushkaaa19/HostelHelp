const { User, Student, Worker, Admin } = require("../models");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Strips sensitive/internal fields before sending a user object back to the client.
 */
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new account (STUDENT, WORKER, or ADMIN)
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    rollNumber,
    course,
    year,
    gender,
  } = req.body;

  // Enforce STUDENT role for public registration
  const role = "STUDENT";

  // 1. Basic validation
  if (!name || !email || !password || !rollNumber) {
    return res.status(400).json({
      success: false,
      message: "Name, email, password, and roll number are required",
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  // 2. Check for existing email
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists",
    });
  }

  // 3. Check for existing student roll number
  const existingRoll = await Student.findOne({ rollNumber: rollNumber.trim() });
  if (existingRoll) {
    return res.status(409).json({
      success: false,
      message: "A student with this roll number already exists",
    });
  }

  // 4. Create base User document
  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role,
    phone,
  });

  // 5. Create Student Profile document with rollback handling
  let profile = null;
  try {
    profile = await Student.create({
      user: user._id,
      rollNumber: rollNumber.trim(),
      course,
      year: year ? Number(year) : undefined,
      gender,
    });
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: "Student registered successfully",
    data: {
      user: sanitizeUser(user),
      profile,
      token,
    },
  });
});
/**
 * @route   POST /api/auth/login
 * @desc    Login for STUDENT, WORKER, and ADMIN accounts.
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email and password are required",
    });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Explicitly fetch password since select: false on user schema
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: "Account is deactivated. Please contact the administrator.",
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: sanitizeUser(user),
      token,
    },
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Return the currently authenticated user's identity.
 * @access  Private (any authenticated role)
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(req.user),
    },
  });
});

module.exports = { register, login, getMe };