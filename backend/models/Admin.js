const mongoose = require("mongoose");

/**
 * Admin holds admin-specific profile details and references back to 
 * the User document for authentication identity and role.
 */
const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Admin must reference a user account"],
      unique: true,
    },
    department: {
      type: String,
      trim: true,
      default: "Hostel Administration",
    },
    officeLocation: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);