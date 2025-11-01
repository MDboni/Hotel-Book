import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  roomType: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  amenities: [{ type: String }],
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 },         
  reviewsCount: { type: Number, default: 0 },
}, { timestamps: true });

const Room = mongoose.model("Room", RoomSchema);
export default Room;
