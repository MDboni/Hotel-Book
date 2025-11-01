import express from "express";
import {
  checkAvailabilityApi,
  createBooking,
  getHotelBookings,
  getUserBookings,
} from "../controller/BookingController.js";
import { protect } from "../middleware/AuthMiddleware.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityApi); // spelling fixed
bookingRouter.post("/book", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/hotel", protect, getHotelBookings);

export default bookingRouter;
