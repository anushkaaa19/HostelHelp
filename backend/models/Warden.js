const mongoose = require("mongoose");

/**
 * Warden is NOT a portal/role and does NOT reference User — wardens do not
 * log into the system. A Warden is simply a person record that a Hostel
 * points to, so students can view their hostel's warden contact info.
 * Admin manages Warden records directly.
 */
const wardenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Warden name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Warden phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Warden", wardenSchema);
