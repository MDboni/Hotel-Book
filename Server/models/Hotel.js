import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  owner: { type: String, required: true }, // Clerk user ID হবে
}, { timestamps: true });

const Hotel = mongoose.model("Hotel", HotelSchema);
export default Hotel;
