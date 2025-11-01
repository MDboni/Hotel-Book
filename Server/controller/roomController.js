import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";

// ✅ Create Room
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    // লগ-ইন করা ইউজারের hotel খুঁজে বের করা
    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) {
      return res.status(400).json({ success: false, message: "No hotel available for this user" });
    }

    // ছবি upload করা Cloudinary তে
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadImages = req.files.map(async (file) => {
        const response = await cloudinary.uploader.upload(file.path);
        return response.secure_url;
      });
      images = await Promise.all(uploadImages);
    }

    // amenities JSON parse করা, যদি string আসে
    let parsedAmenities = [];
    try {
      parsedAmenities = Array.isArray(amenities) ? amenities : JSON.parse(amenities);
    } catch {
      parsedAmenities = [];
    }

    // Room তৈরি করা
    const room = await Room.create({
      hotel: hotel._id,           // hotel ObjectId assign করা
      roomType,
      pricePerNight: +pricePerNight,
      amenities: parsedAmenities,
      images,
      owner: req.user._id,        // owner ঠিকমত assign
    });

    res.status(201).json({ success: true, message: "Room created successfully", room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get all available rooms
export const getRoom = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: "hotel",
        populate: { path: "owner", select: "image username email" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get all rooms of the logged-in hotel owner
export const getOwnerRoom = async (req, res) => {
  try {
    // Find the hotel of this owner
    const hotelData = await Hotel.findOne({ owner: req.user._id });
    if (!hotelData) {
      return res.json({ success: false, message: "No hotel found for this user" });
    }

    // Find all rooms for that hotel
    const rooms = await Room.find({ hotel: hotelData._id }).populate("hotel");
    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Toggle room availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;

    const roomData = await Room.findById(roomId);
    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();

    res.json({ success: true, message: "Room availability updated", room: roomData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



// ✅ Get single room by ID
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    // Room find করা এবং hotel + owner populate করা
    const room = await Room.findById(id)
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "image username email",
        },
      });

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.status(200).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
