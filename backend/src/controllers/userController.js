const User = require("../models/User");
const bcrypt = require("bcrypt");
const Prescription = require("../models/Prescription");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../services/emailService");

const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id; // NEVER trust email from body

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old and new passwords are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("updatePassword Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



const getPrescription = async (req, res) => {
  try {
    const userId = req.user.id;

    const prescriptions = await Prescription.find({ patient: userId })
      .populate("doctor", "userName email");

    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions || [],
    });
  } catch (error) {
    console.error("getPrescription Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



const viewProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("viewProfile Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userName, fullName, email, style } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields if provided
    if (userName && userName !== user.userName) {
        const usernameTaken = await User.findOne({ userName });
        if (usernameTaken) {
            return res.status(409).json({ success: false, message: "Username already taken" });
        }
        user.userName = userName;
    }

    if (email && email !== user.email) {
        const emailTaken = await User.findOne({ email });
        if (emailTaken) {
            return res.status(409).json({ success: false, message: "Email already taken" });
        }
        user.email = email;
        user.isEmailVerified = false; 
        
        // Generate and send OTP for new email
        const OTP = generateOTP();
        user.emailVerificationOTP = OTP;
        user.emailVerificationExpires = Date.now() + 5 * 60 * 1000;

        try {
          await sendEmail(
            email,
            "Email Verification OTP",
            `<p>Your OTP is <b>${OTP}</b>. It is valid for 5 minutes.</p>`
          );
        } catch (e) {
          console.error("Failed to send verification email:", e);
          // We can still proceed but maybe warn the user? For now just log it.
        }
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (style !== undefined) user.style = style;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        userName: user.userName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        style: user.style
      },
    });
  } catch (error) {
    console.error("updateProfile Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("getMe Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = {
  updatePassword,
  getPrescription,
  viewProfile,
  updateProfile,
  getMe,
};
