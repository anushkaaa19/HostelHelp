const mongoose = require("mongoose");

/**
 * Hostel is the top of the hierarchy: Hostel -> Block -> Room -> Students.
 * It references its Warden directly since the Warden <-> Hostel
 * relationship is one-to-one/simple and looked up frequently
 * (e.g. "Student's hostel warden info").
 */
const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hostel name is required"],
      trim: true,
      unique: true,
    },
    address: {
      type: String,
      trim: true,
    },
    warden: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warden",
      default: null,
    },
    facilities: {
      // Simple list of facility names/descriptions (e.g. "Wi-Fi", "Gym", "Laundry").
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hostel", hostelSchema);
