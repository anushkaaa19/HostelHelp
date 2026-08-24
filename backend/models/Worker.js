const mongoose = require("mongoose");

/**
 * Worker holds worker-specific profile data and references back to the
 * User document for authentication identity/role. Workers are assigned
 * to WorkOrders (created from Complaints) by Admin.
 */
const workerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Worker must reference a user account"],
      unique: true,
    },
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
    },
    specialization: {
      // e.g. "PLUMBING", "ELECTRICAL", "CARPENTRY", "CLEANING", "GENERAL"
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Worker", workerSchema);
