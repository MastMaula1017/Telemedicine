  const Appointment = require("../models/Appointment");
  const User = require("../models/User");
  const Doctor = require("../models/Doctor");
  const Coupon = require("../models/Coupon");
const { getIO } = require("../socket");


  // 📌 BOOK APPOINTMENT (Patient)
  async function bookAppointment(req, res) {
    try {
      // Doctors must not book
      if (req.user.role === "Doctor") {
        return res.status(403).json({
          message: "Doctors cannot book appointments",
        });
      }

      const { doctorId, date, day, timeSlot, couponCode } = req.body;
      const patient = req.user.id;

      if (!doctorId || !date || !day || !timeSlot?.start || !timeSlot?.end) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      // get real doctor profile (doctorId = userId)
      const doctor = await Doctor.findOne({ userId: doctorId });

      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      // Check already booked
      const alreadyBooked = await Appointment.findOne({
        doctor: doctor._id,
        date,
        "timeSlot.start": timeSlot.start,
        status: { $in: ["pending", "accepted"] },
      });

      if (alreadyBooked) {
        return res.status(409).json({
          message: "This slot is already booked",
        });
      }

      // Handle Coupon Usage
      let discountApplied = 0;
      if (couponCode) {
          const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
          
          if (coupon) {
              if (coupon.isActive && 
                  new Date() <= new Date(coupon.expirationDate) && 
                  (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit)) {
                  
                  coupon.usedCount += 1;
                  await coupon.save();
                  discountApplied = coupon.discountPercentage;
              }
          }
      }

      const finalAmount = Math.round(doctor.consultationFee * (1 - discountApplied / 100));

      const appointment = await Appointment.create({
        patient,
        doctor: doctor._id,
        date,
        day,
        timeSlot,
        status: "pending",
        paymentInfo: {
            paymentId: `PAY_${Date.now()}`,
            orderId: `ORD_${Date.now()}`,
            amount: finalAmount
        }
      });

      return res.status(201).json({
        message: "Appointment booked successfully",
        appointment,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }



  // 📌 PATIENT — VIEW THEIR OWN APPOINTMENTS
  async function viewAppointment(req, res) {

    try {
      if (!req.user) {
         console.error("❌ No req.user found!");
         return res.status(500).json({ message: "Auth failed inside controller" });
      }
      
      const patientId = req.user.id;

      const appts = await Appointment.find({ patient: patientId })
        .populate({
          path: "doctor",
          select: "name specialization consultationFee userId"
        });
        


      return res.status(200).json({
        success: true,
        appointments: appts,
      });

    } catch (e) {
      console.error("Error in viewAppointment:", e);
      return res.status(500).json({ message: "Server Problem: " + e.message });
    }
  }



  // 📌 DOCTOR — VIEW APPOINTMENTS THEY RECEIVED
  async function doctorViewAppointments(req, res) {
    try {
      if (req.user.role !== "Doctor") {
        return res.status(403).json({ message: "Only doctors can see their appointments" });
      }

      const doctorProfile = await Doctor.findOne({ userId: req.user.id });
      if (!doctorProfile) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      const appts = await Appointment.find({ doctor: doctorProfile._id })
        .populate("patient", "userName email");

      return res.status(200).json({
        success: true,
        appointments: appts,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Problem" });
    }
  }



  // 📌 DOCTOR — ACCEPT OR REJECT APPOINTMENT
  async function updateAppointmentStatus(req, res) {
    try {
      const { appointmentId, status, meetingRoom } = req.body;

      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const doctorProfile = await Doctor.findOne({ userId: req.user.id });

      if (!doctorProfile) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      const appt = await Appointment.findOne({
        _id: appointmentId,
        doctor: doctorProfile._id
      });

      if (!appt) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      appt.status = status;
      if (meetingRoom) appt.meetingRoom = meetingRoom;
      
      await appt.save();

      const io = getIO();

      // 1. Send Chat Message if Meeting Link exists
      if (status === 'accepted' && meetingRoom) {
          try {
              const Message = require("../models/Message"); // Lazy load to avoid circular deps if any
              
              // Doctor sends message to Patient
              const systemMsg = await Message.create({
                  sender: doctorProfile.userId, // The Doctor User ID
                  receiver: appt.patient,       // The Patient User ID
                  content: `Here is the meeting link for our appointment: ${meetingRoom}`,
                  timestamp: new Date()
              });

              // Emit Receive Message to Patient
              io.to(appt.patient.toString()).emit("receive_message", systemMsg);
              
          } catch (msgErr) {
              console.error("Failed to send auto-chat message:", msgErr);
          }
      }

      // 2. Notification (Existing Logic)
      try {
          io.to(appt.patient.toString()).emit("new_notification", {
              type: "appointment", // or 'message' if you prefer, but keep 'appointment' for status update
              message: `Your appointment has been ${status}`,
              data: appt,
              isRead: false,
              createdAt: new Date()
          });
      } catch (err) {
          console.error("Socket emit failed:", err.message);
      }

      return res.status(200).json({
        success: true,
        message: `Appointment ${status}`,
        appointment: appt
      });

    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Server Problem" });
    }
  }



  // 📌 PATIENT — CANCEL THEIR APPOINTMENT
  async function cancelAppointment(req, res) {
    try {
      const { appointmentId } = req.body;

      const appt = await Appointment.findOne({
        _id: appointmentId,
        patient: req.user.id
      });

      if (!appt) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      appt.status = "cancelled";
      await appt.save();



      // Notify Doctor
      try {
          const doctorDoc = await Doctor.findById(appt.doctor);
          if (doctorDoc && doctorDoc.userId) {
              const io = getIO();
              io.to(doctorDoc.userId.toString()).emit("new_notification", {
                  type: "appointment",
                  message: `Appointment cancelled by patient`,
                  data: appt,
                  isRead: false,
                  createdAt: new Date()
              });
          }
      } catch (err) {
          console.error("Socket emit failed:", err.message);
      }

      return res.status(200).json({
        success: true,
        message: "Appointment cancelled",
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Problem" });
    }
  }


  module.exports = {
    bookAppointment,
    viewAppointment,
    doctorViewAppointments,
    updateAppointmentStatus,
    cancelAppointment
  };
