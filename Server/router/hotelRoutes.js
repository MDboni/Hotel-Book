import express from "express";
import { protect } from "../middleware/AuthMiddleware.js";
import { registerHotel } from "../controller/HotelControler.js";

const hotelRouter = express.Router();

hotelRouter.post('/', protect,registerHotel );

export default hotelRouter;
