const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT for a given user.
 * The payload intentionally contains only `id` and `role` — everything
 * else about the user should be fetched fresh from the database when
 * needed, not trusted from an old token payload.
 */
const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
