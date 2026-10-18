const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized: Missing or invalid token",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      const secretKey = process.env.SECRET_KEY || "super_secret_jwt_key_telemed_123!";
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    // Attach decoded user to request
    req.user = decoded;

    // Block inactive users
    if (decoded.isActive === false) {
      return res.status(403).json({
        message: "Your account is blocked. Contact admin.",
      });
    }

    next();
  } catch (err) {
    console.log("Auth Middleware Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = authMiddleware;
