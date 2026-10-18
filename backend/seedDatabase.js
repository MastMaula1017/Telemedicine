const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./src/models/User');
const Doctor = require('./src/models/Doctor');
const Admin = require('./src/models/Admin');

const doctorsList = [
  {
    name: "Dr. Sarah Jenkins",
    email: "sarah.jenkins@telemed.com",
    specialization: "Cardiologist",
    qualification: "MD Cardiology, FACC",
    experience: 12,
    consultationFee: 1200,
    rating: 4.9,
    totalRatings: 48,
    bio: "Senior Cardiologist with 12+ years of experience in cardiovascular diagnosis, hypertension, and preventive cardiac wellness.",
    availableDays: ["Monday", "Wednesday", "Friday"]
  },
  {
    name: "Dr. Rajesh Sharma",
    email: "rajesh.sharma@telemed.com",
    specialization: "General Physician",
    qualification: "MBBS, MD (Internal Medicine)",
    experience: 8,
    consultationFee: 500,
    rating: 4.8,
    totalRatings: 64,
    bio: "Experienced General Physician dedicated to comprehensive primary care, viral infections, lifestyle disorders, and routine health checks.",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  {
    name: "Dr. Priya Patel",
    email: "priya.patel@telemed.com",
    specialization: "Dermatologist",
    qualification: "MBBS, MD Dermatology (Gold Medalist)",
    experience: 10,
    consultationFee: 800,
    rating: 4.9,
    totalRatings: 92,
    bio: "Specialist in clinical dermatology, acne treatments, hair loss therapy, allergy management, and modern skin rejuvenation.",
    availableDays: ["Tuesday", "Thursday", "Saturday"]
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@telemed.com",
    specialization: "Neurologist",
    qualification: "MD, DM Neurology",
    experience: 15,
    consultationFee: 1500,
    rating: 5.0,
    totalRatings: 37,
    bio: "Board-certified Neurologist focusing on migraines, neuropathies, neurodegenerative disorders, and spine-nerve assessments.",
    availableDays: ["Monday", "Wednesday", "Thursday"]
  },
  {
    name: "Dr. Ananya Iyer",
    email: "ananya.iyer@telemed.com",
    specialization: "Pediatrician",
    qualification: "MBBS, DCH, DNB Pediatrics",
    experience: 7,
    consultationFee: 600,
    rating: 4.8,
    totalRatings: 53,
    bio: "Compassionate pediatrician committed to newborn care, child development milestones, vaccinations, and pediatric nutrition.",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Friday"]
  },
  {
    name: "Dr. Robert Wilson",
    email: "robert.wilson@telemed.com",
    specialization: "Orthopedic",
    qualification: "MS Orthopedics, M.Ch",
    experience: 11,
    consultationFee: 1000,
    rating: 4.7,
    totalRatings: 41,
    bio: "Consultant Orthopedic Surgeon specialized in joint pain, sports injuries, arthritis management, and spine rehabilitation.",
    availableDays: ["Tuesday", "Thursday", "Friday", "Saturday"]
  },
  {
    name: "Dr. Sunita Deshmukh",
    email: "sunita.deshmukh@telemed.com",
    specialization: "Gynecologist",
    qualification: "MBBS, MS OB-GYN",
    experience: 9,
    consultationFee: 900,
    rating: 4.9,
    totalRatings: 78,
    bio: "Experienced obstetrician and gynecologist specializing in women's wellness, prenatal counselling, and PCOS/hormonal care.",
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"]
  },
  {
    name: "Dr. David Miller",
    email: "david.miller@telemed.com",
    specialization: "Psychiatrist",
    qualification: "MD Psychiatry",
    experience: 14,
    consultationFee: 1100,
    rating: 4.8,
    totalRatings: 39,
    bio: "Empathetic mental health physician providing evidence-based care for anxiety, stress management, depression, and adult ADHD.",
    availableDays: ["Tuesday", "Wednesday", "Thursday", "Saturday"]
  },
  {
    name: "Dr. Neha Kapoor",
    email: "neha.kapoor@telemed.com",
    specialization: "Dentist",
    qualification: "BDS, MDS Oral & Maxillofacial",
    experience: 6,
    consultationFee: 450,
    rating: 4.7,
    totalRatings: 30,
    bio: "Gentle dental care expert specializing in tele-dental diagnosis, toothache relief, oral hygiene, and cosmetic smile care.",
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"]
  },
  {
    name: "Dr. Vikram Sethi",
    email: "vikram.sethi@telemed.com",
    specialization: "ENT Specialist",
    qualification: "MS ENT, DLO",
    experience: 13,
    consultationFee: 850,
    rating: 4.8,
    totalRatings: 45,
    bio: "Experienced ENT Consultant treating sinusitis, hearing issues, throat infections, vertigo, and allergic rhinitis.",
    availableDays: ["Monday", "Wednesday", "Thursday", "Saturday"]
  }
];

async function seed() {
  try {
    const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/telemedicine";
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB Connected Successfully!");

    const salt = await bcrypt.genSalt(10);
    const adminPasswordHashed = await bcrypt.hash("123456", salt);
    const doctorPasswordHashed = await bcrypt.hash("123456", salt);

    // 1. SEED / UPDATE ADMIN in Admin collection (for /admin login)
    let adminDoc = await Admin.findOne({ email: "admin@gmail.com" });
    if (!adminDoc) {
      adminDoc = new Admin({
        name: "Super Admin",
        email: "admin@gmail.com",
        password: "123456",
        role: "Admin"
      });
      await adminDoc.save();
      console.log("✅ Admin record created in Admin collection (email: admin@gmail.com, password: 123456)");
    } else {
      adminDoc.password = "123456"; // triggers pre-save hash
      await adminDoc.save();
      console.log("✅ Admin record updated in Admin collection (email: admin@gmail.com, password: 123456)");
    }

    // 2. SEED / UPDATE ADMIN in User collection (for general /login page)
    let adminUser = await User.findOne({ email: "admin@gmail.com" });
    if (!adminUser) {
      adminUser = await User.create({
        userName: "Admin",
        fullName: "Super Admin",
        email: "admin@gmail.com",
        password: adminPasswordHashed,
        role: "Admin",
        isEmailVerified: true,
        isActive: true
      });
      console.log("✅ Admin user created in User collection (role: Admin)");
    } else {
      adminUser.role = "Admin";
      adminUser.password = adminPasswordHashed;
      adminUser.isEmailVerified = true;
      adminUser.isActive = true;
      await adminUser.save();
      console.log("✅ Admin user updated in User collection (role: Admin)");
    }

    // 3. SEED DOCTORS
    console.log(`\nSeeding ${doctorsList.length} Doctors...`);
    for (const doc of doctorsList) {
      let user = await User.findOne({ email: doc.email });
      if (!user) {
        user = await User.create({
          userName: doc.name.replace("Dr. ", ""),
          fullName: doc.name,
          email: doc.email,
          password: doctorPasswordHashed,
          role: "Doctor",
          isEmailVerified: true,
          isActive: true
        });
      } else {
        user.role = "Doctor";
        user.fullName = doc.name;
        user.password = doctorPasswordHashed;
        user.isEmailVerified = true;
        user.isActive = true;
        await user.save();
      }

      // Generate standard slots
      const availableTimes = doc.availableDays.map(day => ({
        day,
        slots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "17:00" },
          { startTime: "18:00", endTime: "20:00" }
        ]
      }));

      let doctorProfile = await Doctor.findOne({ userId: user._id });
      if (!doctorProfile) {
        doctorProfile = await Doctor.create({
          name: doc.name.replace("Dr. ", ""),
          userId: user._id,
          specialization: doc.specialization,
          qualification: doc.qualification,
          experience: doc.experience,
          consultationFee: doc.consultationFee,
          availableTimes,
          rating: doc.rating,
          totalRatings: doc.totalRatings,
          bio: doc.bio
        });
        console.log(`  ➕ Added profile for ${doc.name} (${doc.specialization})`);
      } else {
        doctorProfile.name = doc.name.replace("Dr. ", "");
        doctorProfile.specialization = doc.specialization;
        doctorProfile.qualification = doc.qualification;
        doctorProfile.experience = doc.experience;
        doctorProfile.consultationFee = doc.consultationFee;
        doctorProfile.availableTimes = availableTimes;
        doctorProfile.rating = doc.rating;
        doctorProfile.totalRatings = doc.totalRatings;
        doctorProfile.bio = doc.bio;
        await doctorProfile.save();
        console.log(`  🔄 Updated profile for ${doc.name} (${doc.specialization})`);
      }
    }

    console.log("\n==============================================");
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("Admin Email: admin@gmail.com | Password: 123456");
    console.log("Doctor Accounts password: 123456");
    console.log("Total Doctors Seeded:", doctorsList.length);
    console.log("==============================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seed();
