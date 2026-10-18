
const User=require("../models/User")
const jwt=require("jsonwebtoken")

function generateToken(newUser)
{

    const secretKey = process.env.SECRET_KEY || "super_secret_jwt_key_telemed_123!";
    return jwt.sign({
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        userName: newUser.userName,
        isActive: newUser.isActive
    }, secretKey, {
        expiresIn: "5d"
    });
}

module.exports=generateToken