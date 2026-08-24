const mongoose = require("mongoose");

/**
 * GET /api/health
 * Returns a simple status payload confirming the API is running,
 * along with the current MongoDB connection state.
 */
const getHealth = (req, res) => {
  const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(200).json({
    success: true,
    message: "Hostel Management API is running",
    timestamp: new Date().toISOString(),
    database: dbStates[mongoose.connection.readyState] || "unknown",
  });
};

module.exports = { getHealth };
