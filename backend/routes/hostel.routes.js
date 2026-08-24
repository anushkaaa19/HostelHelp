const express = require("express");
const router = express.Router();
const {
  createHostel,
  getAllHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
} = require("../controllers/hostel.controller"); // Ensure filename matches (hostelController vs hostel.controller)

// Import middleware - verify if your file uses export named 'protect' & 'authorize' or 'verifyToken'
const authMiddleware = require("../middleware/auth.middleware"); 

// Safely extract functions handling named vs default exports
const protect = authMiddleware.protect || authMiddleware.verifyToken || authMiddleware;
const authorize = authMiddleware.authorize || authMiddleware.restrictTo;

// Debugging checks: Uncomment if error persists to see what is undefined
// console.log("protect type:", typeof protect);
// console.log("authorize type:", typeof authorize);

// Apply middleware
router.use(protect);
router.use(authorize("ADMIN"));

router.route("/")
  .post(createHostel)
  .get(getAllHostels);

router.route("/:id")
  .get(getHostelById)
  .put(updateHostel)
  .delete(deleteHostel);

module.exports = router;