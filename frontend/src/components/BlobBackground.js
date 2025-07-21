// src/components/BlobBackground.js
import React from "react";

export default function BlobBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 🌤 Light Mode Blobs */}
      <div className="dark:hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw]
          bg-gradient-to-br from-purple-400 to-pink-200
          opacity-30 blur-[160px] rounded-full animate-slow-float
          saturate-[1.4] brightness-[1.2]" />

        <div className="absolute top-[35%] left-[35%] w-[60vw] h-[60vw]
          bg-gradient-to-tr from-fuchsia-300 to-sky-300
          opacity-25 blur-[160px] rounded-full animate-slower-float
          saturate-[1.3] brightness-[1.1]" />
      </div>

      {/* 🌑 Dark Mode Blobs */}
      <div className="hidden dark:block">
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw]
          bg-gradient-to-br from-indigo-500 to-cyan-500
          opacity-40 blur-[180px] rounded-full animate-slow-float
          saturate-[1.5] brightness-[1.3]" />

        <div className="absolute top-[30%] left-[30%] w-[60vw] h-[60vw]
          bg-gradient-to-tr from-purple-600 to-teal-400
          opacity-30 blur-[160px] rounded-full animate-slower-float
          saturate-[1.4] brightness-[1.2]" />
      </div>
    </div>
  );
}
