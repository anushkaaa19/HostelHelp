const mongoose = require("mongoose");

/**
 * Complaint is filed by a Student. `room` is stored explicitly (rather
 * than only being derived via student.room) because a complaint describes
 * an issue at a specific location at the time it was filed — if the
 * student is later reassigned to a different room, the complaint must
 * still point to the room it was actually about.
 *
 * Status lifecycle:
 *   OPEN -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> VERIFIED (closed by student)
 *                                            \-> REOPENED -> back to ASSIGNED/IN_PROGRESS
 *
 * A Complaint does not directly reference its WorkOrder(s); instead
 * WorkOrder references Complaint. This keeps Complaint -> WorkOrder as a
 * one-to-many relationship (a reopened complaint can generate a new
 * WorkOrder) without Complaint needing to track an array of IDs.
 */
const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Complaint must be filed by a student"],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Complaint must reference the room it concerns"],
    },
    category: {
      type: String,
      enum: ["ELECTRICAL", "PLUMBING", "FURNITURE", "CLEANLINESS", "INTERNET", "OTHER"],
      required: [true, "Complaint category is required"],
    },
    title: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Complaint description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "VERIFIED", "REOPENED", "CLOSED"],
      default: "OPEN",
    },
    reopenCount: {
      type: Number,
      default: 0,
    },
    reopenReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
