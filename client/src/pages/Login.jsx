import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaKey,
  FaGoogle,
  FaGithub,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaStar
} from "react-icons/fa";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Define AnimatedButton outside Login to prevent redefinition
const AnimatedButton = ({ text, onClick, icon, variant = "primary" }) => {
  const [clickedBtn, setClickedBtn] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnimatedClick = (e) => {
    e.preventDefault();
    setClickedBtn(text);
    setIsLoading(true);
    onClick?.();
    setTimeout(() => {
      setClickedBtn(null);
      setIsLoading(false);
    }, 2000);
  };

  const isClicked = clickedBtn === text;
  const isPrimary = variant === "primary";

  return (
    <motion.button
      type="button"
      onClick={handleAnimatedClick}
      whileHover={{
        scale: 1.02,
        boxShadow: isPrimary
          ? "0 0 30px rgba(220, 38, 127, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.3)"
          : "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className={`relative w-full flex justify-center items-center gap-2 py-3 px-4 rounded-2xl font-bold shadow-lg transition-all duration-500 overflow-hidden group text-sm sm:text-base ${
        isClicked
          ? "bg-gradient-to-r from-orange-600 to-yellow-500 text-white"
          : isPrimary
          ? "bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white shadow-red-900/50"
          : "bg-gray-800 text-white border border-gray-700 hover:border-red-500/50"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
      <span className="relative z-10">{text}</span>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
            className="relative z-10"
          >
            <FaSpinner />
          </motion.div>
        ) : !isClicked ? (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {icon}
          </motion.span>
        ) : (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <FaCheckCircle />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const NeuromorphicInput = ({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  showToggle,
  toggleShowPassword
}) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
    <div
      className="relative bg-gray-900 rounded-2xl border border-gray-700 group-focus-within:border-red-500/50 transition-all duration-300"
      style={{
        boxShadow:
          "inset 8px 8px 16px rgba(0, 0, 0, 0.8), inset -8px -8px 16px rgba(255, 255, 255, 0.05)"
      }}
    >
      <Icon className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-400 transition-colors duration-300 text-sm sm:text-base" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-3 bg-transparent text-white placeholder-gray-500 outline-none rounded-2xl text-sm sm:text-base"
      />
      {showToggle && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-4 top-4 text-gray-400 hover:text-red-400 transition-colors duration-300 text-sm sm:text-base"
        >
          {type === "text" ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  </div>
);

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  const showMessage = (message, type = "info") => {
    setMsg(message);
    setMsgType(type);
    setTimeout(() => {
      setMsg("");
      setMsgType("");
    }, 5000);
  };

  const getMessageStyle = () => {
    switch (msgType) {
      case "success":
        return "from-yellow-900/50 to-orange-900/50 border-yellow-500/40 text-yellow-200";
      case "error":
        return "from-red-900/50 to-pink-900/50 border-red-500/30 text-red-200";
      default:
        return "from-blue-900/50 to-purple-900/50 border-blue-500/30 text-blue-200";
    }
  };

  // Email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      showMessage("Please fill in all fields", "error");
      return;
    }
    try {
      const { data } = await axios.post(`${API}/auth/login`, {
        email,
        password
      });
      showMessage(data.message || "Login successful!", "success");
      if (data.token) localStorage.setItem("token", data.token);
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    } catch (err) {
      showMessage(err.response?.data?.message || "Login failed", "error");
    }
  };

  // Forgot 1: send OTP
  const sendForgotOtp = async () => {
    if (!email) {
      showMessage("Please enter your email", "error");
      return;
    }
    try {
      const { data } = await axios.post(`${API}/auth/forgot-password`, {
        email
      });
      showMessage(data.message || "OTP sent to your email!", "success");
      setTab("forgot-otp");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to send OTP", "error");
    }
  };

  // Forgot 2: verify OTP
  const verifyForgot = async () => {
    if (!otp) {
      showMessage("Please enter the OTP", "error");
      return;
    }
    try {
      const { data } = await axios.post(`${API}/auth/verify-forgot-otp`, {
        email,
        otp
      });
      showMessage(data.message || "OTP verified successfully!", "success");
      setTab("forgot-reset");
    } catch (err) {
      showMessage(err.response?.data?.message || "Invalid OTP", "error");
    }
  };

  // Forgot 3: reset password
  const resetPwd = async () => {
    if (!newPassword) {
      showMessage("Please enter a new password", "error");
      return;
    }
    try {
      const { data } = await axios.post(`${API}/auth/reset-password`, {
        email,
        newPassword
      });
      showMessage(data.message || "Password reset successfully!", "success");
      setTab("login");
      setPassword("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to reset password", "error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-red-500/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-full mb-3 shadow-lg"
          >
            <FaStar className="text-white text-lg sm:text-xl" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-red-200 to-pink-200 bg-clip-text text-transparent mb-2"
          >
            {tab === "login" && "Welcome Back"}
            {tab === "forgot-email" && "Forgot Password"}
            {tab === "forgot-otp" && "Verify OTP"}
            {tab === "forgot-reset" && "Set New Password"}
          </motion.h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            {tab === "login" && "Sign in to your account"}
            {tab === "forgot-email" && "Enter your account email"}
            {tab === "forgot-otp" && "Enter the OTP sent to your email"}
            {tab === "forgot-reset" && "Set a new password"}
          </p>
        </div>

        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-4 p-3 rounded-2xl bg-gradient-to-r border ${getMessageStyle()}`}
            >
              <div className="flex items-center gap-2 justify-center">
                {msgType === "error" && <FaExclamationTriangle />}
                {msgType === "success" && <FaCheckCircle />}
                <p className="text-center text-xs sm:text-sm font-medium">
                  {msg}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {tab === "login" && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              <NeuromorphicInput
                icon={FaEnvelope}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <NeuromorphicInput
                icon={FaLock}
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showToggle={true}
                toggleShowPassword={() => setShowPwd(!showPwd)}
              />
              <AnimatedButton
                text="Sign In"
                onClick={handleLogin}
                icon={<FaCheckCircle />}
              />
              <div className="flex justify-between items-center text-xs mt-2">
                <button
                  type="button"
                  onClick={() => setTab("forgot-email")}
                  className="text-gray-400 hover:text-red-400 transition-colors z-10 relative"
                  style={{ pointerEvents: "auto" }}
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => (window.location.href = "/signup")}
                  className="text-gray-400 hover:text-red-400 transition-colors z-10 relative"
                  style={{ pointerEvents: "auto" }}
                >
                  Don’t have an account? Sign Up
                </button>
              </div>
            </motion.form>
          )}

          {tab === "forgot-email" && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              <NeuromorphicInput
                icon={FaEnvelope}
                type="email"
                placeholder="Your account email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <AnimatedButton
                text="Send OTP"
                onClick={sendForgotOtp}
                icon={<FaEnvelope />}
              />
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-gray-400 hover:text-red-400 transition-colors text-xs z-10 relative"
                  style={{ pointerEvents: "auto" }}
                >
                  Back to login
                </button>
              </div>
            </motion.form>
          )}

          {tab === "forgot-otp" && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              <NeuromorphicInput
                icon={FaKey}
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <AnimatedButton
                text="Verify OTP"
                onClick={verifyForgot}
                icon={<FaCheckCircle />}
              />
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setTab("forgot-email")}
                  className="text-gray-400 hover:text-red-400 transition-colors text-xs z-10 relative"
                  style={{ pointerEvents: "auto" }}
                >
                  Back to forgot password
                </button>
              </div>
            </motion.form>
          )}

          {tab === "forgot-reset" && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              <NeuromorphicInput
                icon={FaLock}
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <AnimatedButton
                text="Reset Password"
                onClick={resetPwd}
                icon={<FaCheckCircle />}
              />
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-gray-400 hover:text-red-400 transition-colors text-xs z-10 relative"
                  style={{ pointerEvents: "auto" }}
                >
                  Back to login
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-600" />
            <span className="text-gray-500 text-xs">or continue with</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-600" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AnimatedButton
              text="Google"
              onClick={() => window.open(`${API}/auth/google`, "_self")}
              icon={<FaGoogle />}
              variant="secondary"
            />
            <AnimatedButton
              text="GitHub"
              onClick={() => window.open(`${API}/auth/github`, "_self")}
              icon={<FaGithub />}
              variant="secondary"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}


