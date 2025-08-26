import { FaGoogle, FaGithub } from "react-icons/fa";

export default function SocialButtons() {
  return (
    <div className="flex gap-4 mt-6">
      <button
        className="flex items-center gap-2 px-4 py-2 w-full bg-white text-gray-800 rounded-xl shadow hover:scale-105 transition"
      >
        <FaGoogle className="text-red-500" /> Google
      </button>
      <button
        className="flex items-center gap-2 px-4 py-2 w-full bg-gray-800 text-white rounded-xl shadow hover:scale-105 transition"
      >
        <FaGithub /> GitHub
      </button>
    </div>
  );
}
