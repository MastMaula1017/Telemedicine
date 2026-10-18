const express=require('express');
const {login,registerUser,verifyEmail,verifyOTP,forgetPassword,verifyForgotPasswordOtp, me}=require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const route=express.Router()

route.post("/register",registerUser)
route.post("/login",login)
route.post("/verifyEmail",verifyEmail)
route.post("/verifyOTP",verifyOTP)



//forgot password
route.post("/forgotPassword", forgetPassword);
route.post("/forgotPassword/verifyOTP", verifyForgotPasswordOtp);

// Get Current User
route.get("/me", authMiddleware, me);

// Google Auth
const passport = require("passport");
const { googleCallback } = require('../controllers/authController');

route.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
route.get(
  "/google/callback",
  (req, res, next) => {
    const rawFrontend = process.env.FRONTEND_URL || "http://localhost:5173";
    const frontendURL = rawFrontend.replace(/\/+$/, "");
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${frontendURL}/login?error=auth_failed`
    })(req, res, next);
  },
  googleCallback
);



module.exports=route