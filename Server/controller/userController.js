import User from "../models/User.js";


export const getUserData = async (req, res) => {
  try {
    // req.user already populated from protect middleware
    const user = {
      _id: req.user._id,
      clerkId: req.user.clerkId,
      username: req.user.username,
      email: req.user.email,
      image: req.user.image,
      role: req.user.role,
      recentSearchedCities: req.user.recentSearchedCities || [],
    };

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// store User Recent SearceCities 

export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    const user = req.user;

    if (!recentSearchedCity) {
      return res.json({ success: false, message: "City name is required" });
    }

    // ডুপ্লিকেট চেক করা
    if (!user.recentSearchedCities.includes(recentSearchedCity)) {

      // সর্বোচ্চ ৩টি recent city রাখবে
      if (user.recentSearchedCities.length >= 3) {
        user.recentSearchedCities.shift(); // প্রথমটা মুছে দেবে
      }

      user.recentSearchedCities.push(recentSearchedCity);
      await user.save();
    }

    res.json({ success: true, message: "City added successfully", recentSearchedCities: user.recentSearchedCities });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};




// Create or Update user in DB
export const createOrUpdateUser = async (req, res) => {
    try {
        const { id, email, firstName, lastName, imageUrl } = req.body;

        if (!id || !email) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const userData = {
            _id: id,
            clerkId: id,
            email,
            username: `${firstName || ""} ${lastName || ""}`.trim() || "Unknown",
            image: imageUrl || "",
            role: "user",
            recentSearchedCities: [],
        };

        const user = await User.findOneAndUpdate(
            { _id: id },
            userData,
            { upsert: true, new: true }
        );

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

