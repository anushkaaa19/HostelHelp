const dns = require("dns");
dns.setServers(["8.8.8.8"]);
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");

// Import models directly from their files to avoid index export issues
const User = require("../models/User");
const Admin = require("../models/Admin");

const seedAdmin = async () => {
  try {
    console.log("Connecting to Database...");
    await connectDB();
    console.log("Connected to Database:", mongoose.connection.name);

    const email = "admin@hostel.com";

    // Clear old test accounts
    await User.deleteMany({ email });
    console.log("Cleared existing admin user.");

    // 1. Create User
    const user = await User.create({
      name: "Super Admin",
      email,
      password: "AdminPassword123!", // User schema pre-save hook will hash this
      role: "ADMIN",
      isActive: true,
    });
    console.log("SUCCESS: Created User document with ID:", user._id);

    // 2. Create Admin Profile
    const adminProfile = await Admin.create({
      user: user._id,
      department: "Hostel Administration",
      officeLocation: "Main Office 101",
    });
    console.log("SUCCESS: Created Admin document with ID:", adminProfile._id);

    console.log("\n==========================================");
    console.log(`Database Name: ${mongoose.connection.name}`);
    console.log(`Email:         ${user.email}`);
    console.log("Password:      AdminPassword123!");
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR CREATING ADMIN:");
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();