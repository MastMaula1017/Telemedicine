const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');
const Doctor = require('./src/models/Doctor');

dotenv.config();

const docData = {
    name: "Vansh",
    email: "vansh14raturi@gmail.com",
    specialization: "General Physician",
    qualification: "MBBS",
    experience: 5,
    consultationFee: 500,
    bio: "General Physician"
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/telemedicine");
    console.log("Connected to MongoDB");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    let user = await User.findOne({ email: docData.email });
    if (!user) {
      user = await User.create({
        userName: docData.name,
        fullName: "Dr. " + docData.name,
        email: docData.email,
        password: hashedPassword,
        role: "Doctor",
        isEmailVerified: true
      });
      
      await Doctor.create({
        name: docData.name,
        userId: user._id,
        specialization: docData.specialization,
        qualification: docData.qualification,
        experience: docData.experience,
        consultationFee: docData.consultationFee,
        availableTimes: [
          {
            day: "Monday",
            slots: [{ startTime: "10:00", endTime: "13:00" }, { startTime: "14:00", endTime: "17:00" }]
          }
        ],
        rating: 5,
        totalRatings: 1,
        bio: docData.bio
      });
      console.log(`Created Dr. ${docData.name} with email ${docData.email}`);
    } else {
      console.log(`User ${docData.email} already exists.`);
      // Update role and password if user already exists
      user.role = "Doctor";
      user.password = hashedPassword;
      await user.save();
      console.log(`Updated user ${docData.email} to Doctor role and set new password.`);
      
      let doctorProfile = await Doctor.findOne({ userId: user._id });
      if (!doctorProfile) {
          await Doctor.create({
            name: user.fullName || "Dr. Vansh",
            userId: user._id,
            specialization: "General Physician",
            qualification: "MBBS",
            experience: 5,
            consultationFee: 500,
            availableTimes: [],
            rating: 5,
            totalRatings: 1,
            bio: "General Physician"
          });
          console.log(`Created Doctor profile for existing user.`);
      }
    }

    console.log("Process complete!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
