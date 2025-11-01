import transporter from "../config/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Function to Check Availability of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const booking = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    const isAvailable = booking.length === 0;
    return isAvailable;
  } catch (error) {
    console.error(error.message);
  }
};

// API to check availability
export const checkAvailabilityApi = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to create a new booking
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user?._id;

    console.log({ room, checkInDate, checkOutDate, guests, user });

    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    console.log("isAvailable:", isAvailable);
    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    const roomData = await Room.findById(room).populate("hotel");
    console.log("roomData:", roomData);

    let totalPrice = roomData.pricePerNight;
    console.log("totalPrice per night:", totalPrice);

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    console.log("Booking created:", booking);

   const mailOptions = {
  from: process.env.SENDER_EMAIL,
  to: req.user.email,
  subject: "🏨 Hotel Booking Confirmation - " + roomData.hotel.name,
  html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f9f9f9; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg, #0078d7, #00bfa6); color:#fff; text-align:center; padding:25px 10px;">
        <h1 style="margin:0; font-size:22px;">Booking Confirmed!</h1>
        <p style="margin:5px 0 0;">Thank you for choosing <strong>${roomData.hotel.name}</strong></p>
      </div>

      <!-- Body -->
      <div style="padding:25px;">
        <h2 style="color:#333;">Hello ${req.user.username}, 👋</h2>
        <p style="color:#555; line-height:1.6;">
          We’re excited to confirm your hotel booking! Here are your booking details:
        </p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px;">
          <tr style="background:#f4f4f4;">
            <td style="padding:10px 15px; font-weight:bold;">Booking ID:</td>
            <td style="padding:10px 15px;">${booking._id}</td>
          </tr>
          <tr>
            <td style="padding:10px 15px; font-weight:bold;">Hotel Name:</td>
            <td style="padding:10px 15px;">${roomData.hotel.name}</td>
          </tr>
          <tr style="background:#f4f4f4;">
            <td style="padding:10px 15px; font-weight:bold;">Location:</td>
            <td style="padding:10px 15px;">${roomData.hotel.address}</td>
          </tr>
          <tr>
            <td style="padding:10px 15px; font-weight:bold;">Check-in:</td>
            <td style="padding:10px 15px;">${new Date(booking.checkInDate).toDateString()}</td>
          </tr>
          <tr style="background:#f4f4f4;">
            <td style="padding:10px 15px; font-weight:bold;">Check-out:</td>
            <td style="padding:10px 15px;">${new Date(booking.checkOutDate).toDateString()}</td>
          </tr>
          <tr>
            <td style="padding:10px 15px; font-weight:bold;">Total Amount:</td>
            <td style="padding:10px 15px; color:#0078d7; font-weight:bold;">
              ${process.env.CURRENCY || '$'} ${booking.totalPrice} / Per Night
            </td>
          </tr>
        </table>

        <p style="color:#555; margin-top:20px; line-height:1.6;">
          If you need to make any changes or have any questions, feel free to contact our support team anytime.
        </p>

        <div style="text-align:center; margin-top:25px;">
          <a href="https://yourhotelbookingwebsite.com" 
            style="background:#0078d7; color:#fff; padding:12px 25px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
            Manage Your Booking
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
        <p style="margin:0;">© ${new Date().getFullYear()} Hotel Booking Platform. All rights reserved.</p>
        <p style="margin:5px 0 0;">Need help? <a href="mailto:support@hotelbooking.com" style="color:#0078d7; text-decoration:none;">Contact Support</a></p>
      </div>
    </div>
  </div>
  `
};

    await transporter.sendMail(mailOptions)

    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.log("Booking error:", error);
    res.json({ success: false, message: "Booking creation failed" });
  }
};

// API to get all bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch user bookings" });
  }
};

// API to get all bookings for a hotel owner
export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) {
      return res.json({ success: false, message: "No hotel found" });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch hotel bookings" });
  }
};
