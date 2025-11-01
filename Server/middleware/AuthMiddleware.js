import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Clerk থেকে auth data বের করা
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // MongoDB তে Clerk user আছে কিনা চেক করা
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
