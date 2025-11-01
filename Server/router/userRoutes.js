import express from "express";
import { getUserData, storeRecentSearchedCities, createOrUpdateUser } from "../controller/userController.js";
import { protect } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// ✅ Create or Update user (called from frontend)
router.post("/create-or-update", createOrUpdateUser);

// ✅ Get logged in user data
router.get("/", protect, getUserData);

// ✅ Store recent searched city
router.post("/store-recent-searched-city", protect, storeRecentSearchedCities);

export default router;
