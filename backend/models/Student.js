const mongoose = require("mongoose");

/**
 * Student holds student-specific profile data and references back to the
 * User document for authentication identity/role.
 *
 * `room` is the single source of truth for a student's current
 * hostel/block/room assignment. A student's hostel/block are always
 * DERIVED by following room -> block -> hostel; they are never stored
 * directly on Student, so there is only one place that can go stale.
 *
 * IMPORTANT: This field must only ever be written by Admin-facing
 * controllers (room assignment feature), never by the student's own
 * profile-update endpoint.
 *
 * `roommatePreferences` captures the attributes used later by the
 * "find compatible roommates" feature.
 */
const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student must reference a user account"],
      unique: true,
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: 1,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },
    dateOfBirth: {
      type: Date,
    },
    guardianName: {
      type: String,
      trim: true,
    },
    guardianPhone: {
      type: String,
      trim: true,
    },

    // Single source of truth for current room assignment.
    // Hostel/Block are derived via room -> block -> hostel, not stored here.
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },

    // Used by the roommate-matching feature to score compatibility.
    roommatePreferences: {
      sleepSchedule: {
        type: String,
        enum: ["EARLY_RISER", "NIGHT_OWL", "FLEXIBLE"],
      },
      cleanliness: {
        type: String,
        enum: ["VERY_TIDY", "MODERATE", "RELAXED"],
      },
      studyHabits: {
        type: String,
        enum: ["QUIET_STUDY", "MUSIC_WHILE_STUDYING", "GROUP_STUDY"],
      },
      socialPreference: {
        type: String,
        enum: ["INTROVERT", "EXTROVERT", "AMBIVERT"],
      },
      smokingTolerant: {
        type: Boolean,
        default: false,
      },
      guestsTolerant: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
