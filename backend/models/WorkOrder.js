const mongoose = require("mongoose");

/**
 * WorkOrder is created by Admin to assign a Complaint to a Worker.
 * It is the "task" a worker sees under My Tasks. Complaint -> WorkOrder
 * is one-to-many (a reopened complaint can produce a new WorkOrder), so
 * the reference lives here rather than as an array on Complaint.
 *
 * Status lifecycle mirrors the worker feature set:
 *   ASSIGNED -> ACCEPTED -> IN_PROGRESS -> RESOLVED
 */
const workOrderSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: [true, "Work order must reference a complaint"],
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: [true, "Work order must be assigned to a worker"],
    },
    status: {
      type: String,
      enum: ["ASSIGNED", "ACCEPTED", "IN_PROGRESS", "RESOLVED"],
      default: "ASSIGNED",
    },
    acceptedAt: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    resolutionNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkOrder", workOrderSchema);
