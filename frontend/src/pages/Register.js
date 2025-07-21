// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      sessionStorage.setItem("username", data.username);
      window.dispatchEvent(new Event("storage"));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      className="relative max-w-md mx-auto mt-28 p-1 rounded-[30px]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="relative w-full h-full rounded-[28px] bg-white/30 dark:bg-[#1a1a1a]/70 border border-pink-400/40 dark:border-cyan-500/60 shadow-2xl p-8 backdrop-blur-2xl transition-colors duration-500"
style={{
  boxShadow:
    "0 0 25px rgba(255, 0, 255, 0.3), 0 0 35px rgba(0, 255, 255, 0.3)",
}}

      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-500 dark:from-cyan-400 dark:to-sky-500 tracking-tight">
          📝 Join RealTimeCraft
        </h2>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="👤 Username"
            className="w-full p-3 rounded-xl border border-pink-400/30 dark:border-cyan-500/30 bg-white/60 dark:bg-dark-card/70 text-black dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-cyan-500 focus:scale-[1.02] transition-all duration-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="📧 Email"
            className="w-full p-3 rounded-xl border border-pink-400/30 dark:border-cyan-500/30 bg-white/60 dark:bg-dark-card/70 text-black dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-cyan-500 focus:scale-[1.02] transition-all duration-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="🔒 Password"
            className="w-full p-3 rounded-xl border border-pink-400/30 dark:border-cyan-500/30 bg-white/60 dark:bg-dark-card/70 text-black dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-cyan-500 focus:scale-[1.02] transition-all duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-pink-500 to-purple-500 dark:from-sky-500 dark:to-indigo-500 shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            ✅ Register
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-light-accent dark:text-dark-accent hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
