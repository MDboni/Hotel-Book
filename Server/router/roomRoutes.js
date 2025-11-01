import express from "express";
import {
  createRoom,
  getOwnerRoom,
  getRoom,
  getRoomById,
  toggleRoomAvailability
} from "../controller/roomController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/AuthMiddleware.js";

const roomRouter = express.Router();

// Create new room
roomRouter.post('/', protect, upload.array('images', 4), createRoom);

// Get all rooms
roomRouter.get('/', getRoom);

// Get rooms owned by logged-in user
roomRouter.get('/owner', protect, getOwnerRoom);

// Get single room by ID
roomRouter.get('/:id', getRoomById);

// Toggle availability
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability);

export default roomRouter;
