// context/AppContext.js
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

// 🔧 Set default backend URL (fallback to localhost)
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  // ✅ Fetch all rooms
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms");
      if (data.success) setRooms(data.rooms);
      else toast.error(data.message);
    } catch (error) {
      console.error("❌ Room Fetch Error:", error);
      toast.error("Failed to load rooms");
    }
  };

  // ✅ Save or update user in MongoDB
  const saveUserToDB = async (token) => {
    try {
      if (!user) return;

      const payload = {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl || user.profileImageUrl,
      };

      const { data } = await axios.post("/api/user/create-or-update", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.success) {
        toast.error(data.message || "User save failed");
      }
    } catch (error) {
      console.error("❌ Save User Error:", error);
      toast.error("Failed to save user");
    }
  };

  // ✅ Fetch logged-in user data

const fetchUser = async (token) => {
  try {
    const { data } = await axios.get('/api/user', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.success && data.user) {
      // 🔥 নিশ্চিতভাবে role check করে নাও
      setIsOwner(data.user.role === "hotelOwner");
      setSearchedCities(data.user.recentSearchedCities || []);
    } else {
      console.log("❌ No user data in response:", data);
    }
  } catch (error) {
    console.error("fetchUser error:", error.message);
  }
};


  // ✅ Initialize user (save then fetch)
  useEffect(() => {
    const initUser = async () => {
      if (!user) return;

      try {
        const token = await getToken();
        if (!token) {
          console.warn("⚠️ No token found for Clerk user");
          return;
        }

        await saveUserToDB(token); // Save or update user first
        await fetchUser(token);    // Then fetch updated data
      } catch (error) {
        console.error("❌ InitUser Error:", error);
      }
    };

    initUser();
  }, [user]);

  // ✅ Fetch rooms on first load
  useEffect(() => {
    fetchRooms();
  }, []);

  // ✅ Context value
  const value = {
    currency,
    user,
    navigate,
    getToken,
    isOwner,
    showHotelReg,
    axios,
    setIsOwner,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ✅ Custom hook
export const useAppContext = () => useContext(AppContext);
