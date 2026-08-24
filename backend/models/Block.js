const mongoose = require("mongoose");

/**
 * Block belongs to exactly one Hostel. Rooms belong to a Block, so a
 * Room's hostel is always derived by following block.hostel — we do not
 * duplicate a hostel reference on Block or Room to avoid two sources of
 * truth that could drift out of sync.
 */
const blockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Block name is required"],
      trim: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: [true, "Block must belong to a hostel"],
    },
  },
  { timestamps: true }
);

// A block name should be unique within a given hostel (e.g. two different
// hostels can each have a "Block A", but not the same hostel twice).
blockSchema.index({ hostel: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Block", blockSchema);
