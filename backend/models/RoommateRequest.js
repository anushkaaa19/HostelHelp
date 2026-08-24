const mongoose = require("mongoose");

/**
 * RoommateRequest represents one student inviting another to be roommates
 * (found via the "find compatible roommates" feature). Admin can view all
 * requests; actually moving students into a shared room is still an
 * Admin-only room-assignment action, not something this model performs
 * by itself.
 */
const roommateRequestSchema = new mongoose.Schema(
  {
    fromStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Request must have a sender"],
    },
    toStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Request must have a recipient"],
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"],
      default: "PENDING",
    },
    message: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate pending requests from the same sender to the same recipient.
roommateRequestSchema.index({ fromStudent: 1, toStudent: 1, status: 1 });

module.exports = mongoose.model("RoommateRequest", roommateRequestSchema);
