const mongoose = require("mongoose");

/**
 * Room belongs to exactly one Block (and therefore indirectly to one
 * Hostel, via block.hostel). There is intentionally NO bed-level entity —
 * capacity is a simple number, and occupancy is derived by counting
 * Student documents whose `room` field points here.
 */
const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "Room capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
      required: [true, "Room must belong to a block"],
    },
  },
  { timestamps: true }
);

// A room number should be unique within a given block.
roomSchema.index({ block: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model("Room", roomSchema);
