// backend/middleware/auth.middleware.js

const protect = (req, res, next) => {
  // Your JWT verification logic here
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

// MUST export as an object with named properties
module.exports = { protect, authorize };