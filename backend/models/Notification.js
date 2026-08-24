const mongoose = require("mongoose");

/**
 * Notification references User directly (not Student/Worker) because
 * notifications are a cross-cutting concern for every role — students,
 * workers, and admins all receive them through the same User identity.
 */
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Notification must belong to a user"],
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },
    type: {
      // Broad category so the frontend can style/route notifications.
      type: String,
      enum: [
        "COMPLAINT_UPDATE",
        "WORK_ORDER_UPDATE",
        "ROOMMATE_REQUEST",
        "ROOM_ASSIGNMENT",
        "MESS_MENU",
        "GENERAL",
      ],
      default: "GENERAL",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Optional pointer to the related document (Complaint, WorkOrder, etc.)
    // so the frontend can deep-link when the notification is clicked.
    relatedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    relatedEntityModel: {
      type: String,
      enum: ["Complaint", "WorkOrder", "RoommateRequest", "Room", "MessMenu", null],
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
