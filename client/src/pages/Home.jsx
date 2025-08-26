import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaSignOutAlt, FaBars, FaTimes, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const Navbar = ({ userName, profilePic, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 bg-gradient-to-r from-black via-gray-900 to-red-950 shadow-lg z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex items-center"
          >
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-red-200 to-pink-200 bg-clip-text text-transparent">
              PremiumApp
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <motion.div className="flex items-center gap-3">
              <motion.img
                src={profilePic || "https://i.pravatar.cc/150"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-red-500/50 object-cover"
                whileHover={{ scale: 1.1, rotateY: 10 }}
              />
              <span className="text-gray-200 text-sm font-medium">
                Welcome, {userName || "User"}!
              </span>
            </motion.div>
            <motion.button
              onClick={onLogout}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95, rotateX: -5 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-300"
            >
              <FaSignOutAlt />
              Logout
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-200 hover:text-red-400 transition-colors"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-gray-900 rounded-b-2xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                <motion.div className="flex items-center gap-3">
                  <motion.img
                    src={profilePic || "https://i.pravatar.cc/150"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-red-500/50 object-cover"
                    whileHover={{ scale: 1.1, rotateY: 10 }}
                  />
                  <span className="text-gray-200 text-sm font-medium">
                    Welcome, {userName || "User"}!
                  </span>
                </motion.div>
                <motion.button
                  onClick={onLogout}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  whileTap={{ scale: 0.95, rotateX: -5 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-300"
                >
                  <FaSignOutAlt />
                  Logout
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default function Home() {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please login");
          setIsLoading(false);
          return;
        }

        const res = await axios.get(`${API}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserName(res.data.user.name);
        setProfilePic(res.data.user.profilePic);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 overflow-hidden">
      <Navbar userName={userName} profilePic={profilePic} onLogout={handleLogout} />

      <div className="pt-20 sm:pt-24 flex items-center justify-center min-h-screen px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="w-full max-w-md text-center"
        >
          <AnimatePresence>
            {isLoading ? (
              <motion.div className="text-gray-400 text-sm">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <FaSpinner className="text-xl" />
                </motion.div>
                <span className="ml-2">Loading...</span>
              </motion.div>
            ) : error ? (
              <motion.div className="p-3 rounded-2xl bg-gradient-to-r from-red-900/60 to-pink-900/60 border border-red-500/40 text-red-200">
                <div className="flex items-center gap-2 justify-center">
                  <FaExclamationTriangle />
                  <p className="text-center text-sm font-medium">{error}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div className="space-y-6">
                <p className="text-gray-200 text-xl sm:text-2xl font-semibold">
                  Hello {userName}! 🚀
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  whileTap={{ scale: 0.95, rotateX: -5 }}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-300"
                >
                  Explore Features
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
