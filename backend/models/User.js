const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User holds the authentication identity for every person in the system,
 * regardless of role. Student, Worker, and (implicitly) Admin-specific
 * profile data live in their own collections and reference back to this
 * document via a `user` field.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // never returned by default in queries
    },
    role: {
      type: String,
      required: true,
      enum: ["STUDENT", "WORKER", "ADMIN"],
    },
    phone: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash the password before saving, but only when it has actually changed
// (so re-saving a user for unrelated updates doesn't re-hash an already-hashed value).
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare a plaintext candidate password against the
// stored hash. Requires the document to have been fetched with
// .select("+password"), since `password` is excluded by default.
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

