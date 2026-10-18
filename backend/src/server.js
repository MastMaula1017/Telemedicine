const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });

const cors = require("cors");
const DB = require("./config/db");
const http = require("http");
const { initSocket } = require("./socket");

DB();

const app = express();
const server = http.createServer(app);
const io = initSocket(server);
const authMiddleware = require("./middlewares/authMiddleware");

const PORT = process.env.PORT || 5000;

// Standard Middleware Setup
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rawFrontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const cleanFrontendUrl = rawFrontendUrl.replace(/\/+$/, "");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://telemedconnecto.netlify.app",
  cleanFrontendUrl,
  `${cleanFrontendUrl}/`
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, "");
      const isAllowed =
        allowedOrigins.some((o) => o.replace(/\/+$/, "") === normalizedOrigin) ||
        normalizedOrigin.endsWith(".netlify.app");

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in deployment to avoid blocking users
      }
    },
    credentials: true,
  })
);

// Authentication Config
const passport = require("./config/passport");
app.use(passport.initialize());


const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const doctorRoute = require("./routes/doctorRoutes");
const appointmentRoute = require("./routes/appointmentRouter");
const prescriptionRoute = require("./routes/prescriptionRoutes");
const adminRoute = require("./routes/adminRoutes");
const messageRoute = require("./routes/messageRoutes");
const couponRoute = require("./routes/couponRoutes");
const paymentRoute = require("./routes/paymentRoutes");
const contactRoute = require("./routes/contactRoutes");

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/doctors", doctorRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/api/appointment", appointmentRoute);
app.use("/api/prescription", prescriptionRoute);
app.use("/api/prescriptions", prescriptionRoute);
app.use("/api/admin", adminRoute);
app.use("/api/messages", messageRoute);
app.use("/api/coupons", couponRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/contact", contactRoute);
const reviewController = require("./controllers/reviewController");
app.post("/api/reviews", authMiddleware, reviewController.addReview);
app.get("/api/reviews/:doctorId", reviewController.getReviews);

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT} 🚀`);
  console.log(`Socket.io is ready ⚡`);

  // Start scheduled tasks (cron)
  const initCronJobs = require("./utils/cronJobs");
  initCronJobs();

});
