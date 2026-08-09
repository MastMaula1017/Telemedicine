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
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login?error=auth_failed" }),
  googleCallback
);



module.exports=route