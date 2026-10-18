const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { doctorRoleMiddleware } = require("../middlewares/roleMiddleware");

const {
  createOrUpdateDoctorProfile,
  getDoctorProfile,
  getDoctorById,
  getAllDoctors,
  checkProfileStatus,
  updateDoctorSchedule,
  getDoctorPublicProfile,
  getDoctorPayments,
} = require("../controllers/doctorController");


router.get("/profile/status", authMiddleware, doctorRoleMiddleware, checkProfileStatus);

router.post("/profile", authMiddleware, doctorRoleMiddleware, createOrUpdateDoctorProfile);

// 📌 UPDATE SCHEDULE
router.put("/schedule", authMiddleware, doctorRoleMiddleware, updateDoctorSchedule);

router.get("/profile", authMiddleware, getDoctorProfile);
router.get("/profile/:id", getDoctorPublicProfile); // Public profile access
// router.put("/profile", authMiddleware, updateDoctorProfile); // Removed as createOrUpdate handles this
router.get("/", getAllDoctors);
router.get("/payments/history", authMiddleware, getDoctorPayments);
router.get("/:id", getDoctorById);

module.exports = router;
