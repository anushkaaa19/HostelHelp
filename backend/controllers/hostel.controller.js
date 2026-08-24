const mongoose = require("mongoose");
const { Hostel, Warden } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @route   POST /api/hostels
 * @desc    Create a new hostel
 * @access  Private (ADMIN only)
 */
const createHostel = asyncHandler(async (req, res) => {
  const { name, address, warden, facilities } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Hostel name is required",
    });
  }

  const existingHostel = await Hostel.findOne({ name: name.trim() });
  if (existingHostel) {
    return res.status(409).json({
      success: false,
      message: "A hostel with this name already exists",
    });
  }

  if (warden) {
    if (!mongoose.Types.ObjectId.isValid(warden)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Warden ID format",
      });
    }
    const wardenDoc = await Warden.findById(warden);
    if (!wardenDoc) {
      return res.status(404).json({
        success: false,
        message: "Referenced Warden does not exist",
      });
    }
  }

  const hostel = await Hostel.create({
    name: name.trim(),
    address: address ? address.trim() : "",
    warden: warden || null,
    facilities: Array.isArray(facilities) ? facilities : [],
  });

  const populatedHostel = await hostel.populate("warden");

  res.status(201).json({
    success: true,
    message: "Hostel created successfully",
    data: populatedHostel,
  });
});

/**
 * @route   GET /api/hostels
 * @desc    View all hostels
 * @access  Private (ADMIN only)
 */
const getAllHostels = asyncHandler(async (req, res) => {
  const hostels = await Hostel.find()
    .populate("warden")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: hostels.length,
    data: hostels,
  });
});

/**
 * @route   GET /api/hostels/:id
 * @desc    View single hostel details
 * @access  Private (ADMIN only)
 */
const getHostelById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Hostel ID format",
    });
  }

  const hostel = await Hostel.findById(id).populate("warden");

  if (!hostel) {
    return res.status(404).json({
      success: false,
      message: "Hostel not found",
    });
  }

  res.status(200).json({
    success: true,
    data: hostel,
  });
});

/**
 * @route   PUT /api/hostels/:id
 * @desc    Update hostel details
 * @access  Private (ADMIN only)
 */
const updateHostel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, address, warden, facilities } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Hostel ID format",
    });
  }

  const hostel = await Hostel.findById(id);
  if (!hostel) {
    return res.status(404).json({
      success: false,
      message: "Hostel not found",
    });
  }

  if (name && name.trim() !== hostel.name) {
    const duplicate = await Hostel.findOne({ name: name.trim() });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Another hostel with this name already exists",
      });
    }
    hostel.name = name.trim();
  }

  if (address !== undefined) hostel.address = address.trim();

  if (warden !== undefined) {
    if (warden !== null) {
      if (!mongoose.Types.ObjectId.isValid(warden)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Warden ID format",
        });
      }
      const wardenDoc = await Warden.findById(warden);
      if (!wardenDoc) {
        return res.status(404).json({
          success: false,
          message: "Referenced Warden does not exist",
        });
      }
    }
    hostel.warden = warden;
  }

  if (facilities !== undefined && Array.isArray(facilities)) {
    hostel.facilities = facilities;
  }

  await hostel.save();
  const updatedHostel = await hostel.populate("warden");

  res.status(200).json({
    success: true,
    message: "Hostel updated successfully",
    data: updatedHostel,
  });
});

/**
 * @route   DELETE /api/hostels/:id
 * @desc    Delete hostel safely (checks for dependent references)
 * @access  Private (ADMIN only)
 */
const deleteHostel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Hostel ID format",
    });
  }

  const hostel = await Hostel.findById(id);
  if (!hostel) {
    return res.status(404).json({
      success: false,
      message: "Hostel not found",
    });
  }

  // Safe Deletion Integrity Check: Dynamic collection scan
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    if (collection.collectionName === "hostels") continue;

    const dependentCount = await collection.countDocuments({ hostel: hostel._id });
    if (dependentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete hostel. Active references exist in '${collection.collectionName}' collection (${dependentCount} record(s) bound).`,
      });
    }
  }

  await Hostel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Hostel deleted successfully",
  });
});

module.exports = {
  createHostel,
  getAllHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
};