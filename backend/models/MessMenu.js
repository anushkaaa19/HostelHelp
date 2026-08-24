const mongoose = require("mongoose");

/**
 * MessMenu belongs to a Hostel (mess facilities are managed per hostel).
 * One document represents a single day's menu for that hostel.
 */
const messMenuSchema = new mongoose.Schema(
  {
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: [true, "Mess menu must belong to a hostel"],
    },
    dayOfWeek: {
      type: String,
      enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
      required: [true, "Day of week is required"],
    },
    breakfast: {
      type: [String],
      default: [],
    },
    lunch: {
      type: [String],
      default: [],
    },
    snacks: {
      type: [String],
      default: [],
    },
    dinner: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// One menu document per hostel per day of week.
messMenuSchema.index({ hostel: 1, dayOfWeek: 1 }, { unique: true });

module.exports = mongoose.model("MessMenu", messMenuSchema);
