import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaKey,
  FaGoogle,
  FaGithub,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaStar,
  FaUpload,
  FaImage,
  FaCloudUploadAlt,
  FaMagic
} from "react-icons/fa";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Define AnimatedButton outside PremiumSignup to prevent redefinition
const AnimatedButton = ({ text, onClick, icon, variant = "primary", disabled = false }) => {
  const [clickedBtn, setClickedBtn] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnimatedClick = () => {
    if (disabled) return;
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
      disabled={disabled}
      whileHover={!disabled ? {
        scale: 1.02,
        rotateY: 5,
        boxShadow: isPrimary
          ? "0 0 30px rgba(220, 38, 127, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.3)"
          : "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)"
      } : {}}
      whileTap={!disabled ? { scale: 0.98, rotateX: -5 } : {}}
      transition={{ duration: 0.3 }}
      style={{ transformStyle: "preserve-3d" }}
      className={`relative w-full flex justify-center items-center gap-2 py-3 px-4 rounded-2xl font-bold shadow-lg transition-all duration-500 overflow-hidden group text-sm sm:text-base ${
        disabled
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : isClicked
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

// Define NeuromorphicInput outside PremiumSignup to prevent redefinition
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
      <Icon className="absolute left-3 top-3 text-gray-400 group-focus-within:text-red-400 transition-colors duration-300 text-sm sm:text-base" />
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
          className="absolute right-3 top-3 text-gray-400 hover:text-red-400 transition-colors duration-300 text-sm sm:text-base"
        >
          {type === "text" ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  </div>
);

// Enhanced FileUploader component with premium animations
const FileUploader = ({ onUpload, userId, onComplete }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus("");
      setIsComplete(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setUploadStatus("");
      setIsComplete(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select an image to upload");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.post(`${API}/user/upload-profile-pic/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadStatus("Profile picture uploaded successfully!");
        setIsComplete(true);
        onUpload?.(res.data.profilePic);
        
        // Call onComplete after successful upload
        setTimeout(() => {
          onComplete?.();
        }, 2000);
      }, 500);
      
    } catch (err) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setUploadStatus(err.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    onComplete?.();
  };

  return (
    <motion.div 
      className="space-y-6 overflow-y-auto max-h-[60vh] px-2"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Drag and Drop Area */}
      <motion.div
        className={`relative group cursor-pointer transition-all duration-500 ${
          isDragOver ? 'scale-105' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.02, rotateY: 10, boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)" }}
        whileTap={{ scale: 0.98, rotateX: -10 }}
        style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      >
        <div className={`absolute inset-0 bg-gradient-to-r from-red-600/30 to-pink-600/30 rounded-3xl blur-xl opacity-0 transition-opacity duration-500 ${
          isDragOver || file ? 'opacity-100' : 'group-hover:opacity-100'
        }`} />
        
        <div
          className={`relative bg-gray-900 rounded-3xl border-2 border-dashed transition-all duration-500 p-6 sm:p-8`}
          style={{
            boxShadow: isDragOver || file
              ? "inset 12px 12px 24px rgba(0, 0, 0, 0.9), inset -12px -12px 24px rgba(255, 255, 255, 0.1)"
              : "inset 8px 8px 20px rgba(0, 0, 0, 0.8), inset -8px -8px 20px rgba(255, 255, 255, 0.08)",
            transformStyle: "preserve-3d"
          }}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          
          <div className="text-center">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="upload-icon"
                  initial={{ opacity: 0, y: 20, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20, rotateX: 20 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="space-y-4"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    animate={{ 
                      y: [-10, 10, -10],
                      rotate: [-5, 5, -5],
                      rotateY: [-10, 10, -10],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-4 transition-all duration-500 ${
                      isDragOver 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/40'
                        : 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300'
                    }`}
                  >
                    <motion.div
                      animate={isDragOver ? { scale: [1, 1.2, 1], rotateX: [0, 10, 0], rotateY: [0, 15, 0] } : {}}
                      transition={{ duration: 0.6, repeat: isDragOver ? Infinity : 0 }}
                    >
                      <FaCloudUploadAlt className="text-xl sm:text-2xl" />
                    </motion.div>
                  </motion.div>
                  
                  <div>
                    <h3 className={`text-base sm:text-lg font-bold mb-2 transition-colors duration-500 ${
                      isDragOver ? 'text-red-300' : 'text-white'
                    }`}>
                      {isDragOver ? 'Drop your image here' : 'Upload Profile Picture'}
                    </h3>
                    <p className="text-gray-400 text-xs mb-3">
                      Drag & drop or click to select
                    </p>
                    <p className="text-gray-500 text-xs">
                      Supports JPG, PNG, WEBP • Max 5MB
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file-preview"
                  initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="space-y-4"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, 0, -2, 0],
                      rotateX: [0, 5, 0, -5, 0],
                      rotateY: [0, 10, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4 shadow-lg shadow-yellow-500/40"
                  >
                    <FaImage className="text-white text-xl sm:text-2xl" />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-yellow-300 mb-2">
                      Image Selected
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm mb-2 truncate max-w-xs mx-auto">
                      {file.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Upload Progress */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, height: 0, rotateX: -20 }}
            animate={{ opacity: 1, height: "auto", rotateX: 0 }}
            exit={{ opacity: 0, height: 0, rotateX: 20 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="space-y-2"
          >
            <div className="relative bg-gray-800 rounded-full h-2 sm:h-3 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-100, 400] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      {file && !isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20, rotateY: -10 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <AnimatedButton
            text={isUploading ? "Uploading..." : "Upload Image"}
            onClick={handleUpload}
            icon={
              <motion.div
                animate={isUploading ? { 
                  y: [-10, -30, -10], 
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.2, 1],
                  rotateX: [0, 10, 0],
                  rotateY: [0, 15, 0] 
                } : {}}
                transition={{ duration: 1, repeat: isUploading ? Infinity : 0 }}
              >
                {isUploading ? <FaSpinner /> : <FaUpload />}
              </motion.div>
            }
            disabled={isUploading}
          />
        </motion.div>
      )}

      {/* Skip Button */}
      {!isComplete && (
        <motion.button
          type="button"
          onClick={handleSkip}
          className="w-full text-gray-400 hover:text-red-400 transition-colors text-xs sm:text-sm py-2"
          whileHover={{ scale: 1.02, rotateY: 5, color: "#ff4d4d" }}
          whileTap={{ scale: 0.98, rotateX: -5 }}
        >
          Skip for now
        </motion.button>
      )}

      {/* Status Messages */}
      <AnimatePresence>
        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.8, rotateX: -15 }}
            animate={{ opacity: 1, height: "auto", scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, height: 0, scale: 0.8, rotateX: 15 }}
            transition={{ duration: 0.5, type: "spring" }}
            className={`p-3 sm:p-4 rounded-2xl border-2 bg-gradient-to-r ${
              uploadStatus.includes("successfully")
                ? "from-yellow-900/60 to-orange-900/60 border-yellow-500/50 text-yellow-200"
                : "from-red-900/60 to-pink-900/60 border-red-500/40 text-red-200"
            }`}
          >
            <div className="flex items-center gap-3 justify-center">
              {uploadStatus.includes("successfully") ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    type: "spring",
                    delay: 0.2
                  }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 360],
                      rotateY: [0, 180, 0],
                      boxShadow: ["0 0 0 rgba(255,255,0,0)", "0 0 20px rgba(255,255,0,0.5)", "0 0 0 rgba(255,255,0,0)"]
                    }}
                    transition={{ 
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity
                    }}
                  >
                    <FaCheckCircle className="text-lg sm:text-xl" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  animate={{ 
                    x: [-2, 2, -2],
                    rotateY: [-10, 10, -10]
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: 3
                  }}
                >
                  <FaExclamationTriangle className="text-base sm:text-lg" />
                </motion.div>
              )}
              <motion.p 
                className="text-center text-xs sm:text-sm font-medium"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {uploadStatus}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateX: -30 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotateX: 30 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="text-center py-4"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360],
                rotateY: [0, 180, 0],
                filter: [
                  "hue-rotate(0deg) brightness(1)",
                  "hue-rotate(180deg) brightness(1.2)",
                  "hue-rotate(360deg) brightness(1)"
                ],
                boxShadow: ["0 0 0 rgba(255,255,0,0)", "0 0 30px rgba(255,255,0,0.7)", "0 0 0 rgba(255,255,0,0)"]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-5xl sm:text-6xl mb-4"
            >
              <FaMagic />
            </motion.div>
            <h3 className="text-base sm:text-lg font-bold text-yellow-300 mb-2">
              Perfect!
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Redirecting to your dashboard...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function PremiumSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // "success", "error", "info"
  const [userId, setUserId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const showMessage = (message, type = "info") => {
    setMsg(message);
    setMsgType(type);
    setTimeout(() => {
      setMsg("");
      setMsgType("");
    }, 5000);
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      showMessage("Please fill in all fields", "error");
      return;
    }
    try {
      const res = await axios.post(`${API}/auth/register`, form);
      showMessage(
        res.data.message || "OTP sent to your email successfully!",
        "success"
      );
      setStep(2);
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Signup failed. Please try again.",
        "error"
      );
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      showMessage("Please enter the OTP", "error");
      return;
    }
    try {
      const res = await axios.post(`${API}/auth/verify-otp`, {
        email: form.email,
        otp
      });
      setUserId(res.data.user.id); // Store user ID for profile pic upload
      showMessage(
        res.data.message || "Account verified successfully!",
        "success"
      );
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setStep(3);
      }, 2000);
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Invalid OTP. Please try again.",
        "error"
      );
    }
  };

  const handleProfilePicUpload = (profilePicUrl) => {
    // Optional: Handle the uploaded profile picture URL if needed
    console.log("Profile picture uploaded:", profilePicUrl);
  };

  const handleUploadComplete = () => {
    // This function will be called after image upload or skip
    setTimeout(() => {
      window.location.href = "/home";
    }, 2000);
  };

  const getMessageStyle = () => {
    switch (msgType) {
      case "success":
        return "from-yellow-900/60 to-orange-900/60 border-yellow-500/50 text-yellow-200";
      case "error":
        return "from-red-900/60 to-pink-900/60 border-red-500/40 text-red-200";
      default:
        return "from-blue-900/60 to-purple-900/60 border-blue-500/40 text-blue-200";
    }
  };

  const navigateToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-red-500/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
              rotateY: [0, 180, 0]
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transformStyle: "preserve-3d"
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: -20 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="w-full max-w-md"
        style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-full mb-3 shadow-lg shadow-red-500/40"
          >
            <FaStar className="text-white text-lg sm:text-xl" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-red-200 to-pink-200 bg-clip-text text-transparent mb-2"
          >
            {step === 1
              ? "Create Account"
              : step === 2
              ? "Verify Email"
              : "Welcome Aboard"}
          </motion.h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            {step === 1
              ? "Join our premium platform"
              : step === 2
              ? "Enter the OTP sent to your email"
              : "Upload your profile picture to complete setup"}
          </p>
        </div>

        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, height: 0, rotateY: -30 }}
              animate={{ opacity: 1, height: "auto", rotateY: 0 }}
              exit={{ opacity: 0, height: 0, rotateY: 30 }}
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
          {step === 1 && (
            <motion.form
              initial={{ opacity: 0, x: -20, rotateY: -20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: 20, rotateY: 20 }}
              className="space-y-4 overflow-hidden"
            >
              <NeuromorphicInput
                icon={FaUser}
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <NeuromorphicInput
                icon={FaEnvelope}
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <NeuromorphicInput
                icon={FaLock}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                showToggle={true}
                toggleShowPassword={() => setShowPassword(!showPassword)}
              />
              <AnimatedButton
                text="Create Account"
                onClick={handleSignup}
                icon={<FaUser />}
              />
              <div className="text-center">
                <span className="text-gray-400 text-xs">
                  Already have an account?{" "}
                </span>
                <button
                  type="button"
                  className="text-red-400 hover:text-red-300 font-semibold transition-colors text-xs"
                  onClick={navigateToLogin}
                >
                  Sign In
                </button>
              </div>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              initial={{ opacity: 0, x: -20, rotateY: -20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: 20, rotateY: 20 }}
              className="space-y-4 overflow-hidden"
            >
              <NeuromorphicInput
                icon={FaKey}
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <AnimatedButton
                text="Verify Account"
                onClick={handleVerifyOtp}
                icon={<FaCheckCircle />}
              />
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setMsg("");
                  }}
                  className="text-gray-400 hover:text-red-400 transition-colors text-xs"
                >
                  Back to signup
                </button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateX: -30 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className="flex flex-col items-center justify-start space-y-4 overflow-y-auto max-h-[60vh] px-2"
            >
              <AnimatePresence>
                {showSuccessMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8, rotateY: -30 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, y: -50, scale: 1.2, rotateY: 30 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0], rotateY: [0, 10, -10, 0] }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      className="text-4xl sm:text-5xl mb-4"
                    >
                      <FaCheckCircle className="text-yellow-400 mx-auto" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Success!</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Your account has been created successfully
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!showSuccessMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full"
                >
                  <FileUploader 
                    userId={userId} 
                    onUpload={handleProfilePicUpload}
                    onComplete={handleUploadComplete}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
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
        )}
      </motion.div>
    </div>
  );
}