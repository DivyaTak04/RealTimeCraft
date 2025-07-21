import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import DocumentPage from "./pages/DocumentPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BlobBackground from "./components/BlobBackground";
import ProtectedRoute from "./components/ProtectedRoute";

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const [theme, setTheme] = useState("light");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  // 🌙 Theme toggle
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // 🔄 Sync username from sessionStorage
  useEffect(() => {
  fetch("http://localhost:4000/api/auth/me", {
    credentials: "include", // important for session cookies!
  })
    .then((res) => {
      if (!res.ok) throw new Error("Not logged in");
      return res.json();
    })
    .then((data) => {
      setUsername(data.username);
      sessionStorage.setItem("username", data.username); // 👈 Used by editor
    })
    .catch(() => {
      setUsername("");
      sessionStorage.removeItem("username");
    });
}, [location]);


  // 🔁 Handle session changes across tabs (use localStorage now)
useEffect(() => {
  const handleStorage = () => {
    setUsername(sessionStorage.getItem("username") || "");
  };
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}, []);


  const handleLogout = () => {
  fetch("http://localhost:4000/api/auth/logout", {
    method: "POST",
    credentials: "include", // Send cookie
  })
    .finally(() => {
      sessionStorage.removeItem("username");
      setUsername("");
      navigate("/login");
    });
};


  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-light-bg to-purple-100 dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
      <BlobBackground />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/50 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-300 dark:border-slate-800 shadow-md transition-all">
  <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 py-2 flex items-center justify-between">
    
    {/* 🌀 Brand Title */}
    <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md">
      RealTimeCraft
    </h1>

    {!isAuthPage && username && (
      <div className="flex items-center gap-5 sm:gap-6">
        
        {/* 🌗 Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="relative inline-flex items-center h-6 rounded-full w-12 transition duration-300 bg-gray-300 dark:bg-gray-700"
        >
          <span
            className={`transform transition-transform duration-300 ease-in-out inline-block w-5 h-5 bg-white dark:bg-blue-400 rounded-full shadow ${
              theme === "dark" ? "translate-x-6" : "translate-x-1"
            }`}
          ></span>
        </button>

        {/* 🧑 User Badge */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center text-white font-semibold shadow">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-800 dark:text-gray-300 font-semibold">
            {username}
          </span>
        </div>

        {/* 🚪 Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-1 rounded-full text-white font-medium shadow-md transition
            bg-gradient-to-r from-red-500 to-pink-500 hover:brightness-110"
        >
          Logout
        </button>
      </div>
    )}

    {/* Toggle for Login/Register Pages */}
    {isAuthPage && (
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="relative inline-flex items-center h-6 rounded-full w-12 transition duration-300 bg-gray-300 dark:bg-gray-700"
      >
        <span
          className={`transform transition-transform duration-300 ease-in-out inline-block w-5 h-5 bg-white dark:bg-blue-400 rounded-full shadow ${
            theme === "dark" ? "translate-x-6" : "translate-x-1"
          }`}
        ></span>
      </button>
    )}
  </div>
</header>

      <main className="relative z-10 pt-24 px-4 pb-10 sm:px-6 max-w-7xl mx-auto w-full">

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doc/:id"
            element={
              <ProtectedRoute>
                <DocumentPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default AppWrapper;
