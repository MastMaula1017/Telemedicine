const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateOTP = require("../utils/generateOTP");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../services/emailService");



async function registerUser(req, res) {
  try {
    const { userName, email, password, role } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing username/email
    const usernameExist = await User.findOne({ userName });
    const emailExist = await User.findOne({ email });

    if (usernameExist) {
      return res.status(409).json({ message: "Username already exists" });
    } 
    if (emailExist) {
      return res.status(403).json({ message: "Email already exists, login instead" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
      role: role || "Patient",
      isEmailVerified: false
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ message: "Server error" });
  }
}



async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found, please sign up" });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "Your account is blocked. Please contact admin." });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ message: "Server error" });
  }
}



async function verifyEmail(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const OTP = generateOTP();
    user.emailVerificationOTP = OTP;
    user.emailVerificationExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    try {
      await sendEmail(
        email,
        "Email Verification OTP",
        `<p>Your OTP is <b>${OTP}</b>. It is valid for 5 minutes.</p>`
      );
    } catch (e) {
      console.log(`Failed to send email (SMTP error). OTP for ${email} is: ${OTP}`);
      return res.status(200).json({ message: "OTP logged in server console (SMTP failed)" });
    }

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error" });
  }
}



async function verifyOTP(req, res) {
  try {
    const { otp, email } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.emailVerificationExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (String(user.emailVerificationOTP) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isEmailVerified = true;
    user.emailVerificationOTP = null;
    user.emailVerificationExpires = null;
    await user.save();

    await sendEmail(email, "Verification Status", `<p>Your email is verified.</p>`);

    return res.status(200).json({ message: "Email verified successfully" });

  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error" });
  }
}



async function forgetPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const OTP = generateOTP();
    user.emailVerificationOTP = OTP;
    user.emailVerificationExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    try {
      await sendEmail(email, "Reset Password OTP", `<h3>Your OTP: ${OTP}</h3>`);
    } catch (e) {
      console.log(`Failed to send email (SMTP error). OTP for ${email} is: ${OTP}`);
      return res.status(200).json({ message: "OTP logged in server console (SMTP failed)" });
    }

    return res.status(200).json({ message: "OTP sent to your email" });

  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error" });
  }
}



async function verifyForgotPasswordOtp(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (String(user.emailVerificationOTP) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.emailVerificationExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.emailVerificationOTP = null;
    user.emailVerificationExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });

  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error" });
  }
}



async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return res.status(200).json({ user });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error" });
  }
}


async function googleCallback(req, res) {
  const rawFrontend = process.env.FRONTEND_URL || "http://localhost:5173";
  const frontendURL = rawFrontend.replace(/\/+$/, "");
  try {
    if (req.user.isActive === false) {
      return res.redirect(`${frontendURL}/login?error=blocked`);
    }

    const token = generateToken(req.user);
    // Redirect to frontend with token
    res.redirect(`${frontendURL}/auth/success?token=${token}`);
  } catch (e) {
    console.log(e);
    res.redirect(`${frontendURL}/login?error=auth_failed`);
  }
}

module.exports = {
  registerUser,
  login,
  verifyEmail,
  verifyOTP,
  forgetPassword,
  verifyForgotPasswordOtp,
  me,
  googleCallback
};
