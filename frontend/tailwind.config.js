/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  safelist: [
    "bg-light-bg",
    "bg-light-card",
    "bg-light-text",
    "bg-light-accent",
    "bg-pink-300/40",
    "bg-blue-600/40",
    "dark:bg-dark-card",
    "dark:bg-dark-text",
    "dark:bg-dark-accent",
    "animate-blob-move",
    "animate-fade-in", // 👈 Safelist fade-in
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        light: {
          bg: "#f9fafb",
          card: "#ffffff",
          text: "#1f2937",
          accent: "#6366f1",
          highlight: "#ec4899",
        },
        dark: {
          bg: "#0f172a",
          card: "#1e293b",
          text: "#e2e8f0",
          accent: "#0ea5e9",
          highlight: "#f472b6",
        },
      },
      animation: {
        "blob-slow": "blob-move 20s ease-in-out infinite",
        "blob-delay": "blob-move 25s ease-in-out infinite",
        "slow-float": "floatBlob 30s ease-in-out infinite",
        "slower-float": "floatBlob 45s ease-in-out infinite",
        "fade-in": "fade-in 0.3s ease-in-out", // 👈 New animation
      },
      keyframes: {
        "blob-move": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(20px, -30px) scale(1.05)" },
          "66%": { transform: "translate(-30px, 10px) scale(0.95)" },
        },
        floatBlob: {
          "0%, 100%": {
            transform: "translateY(0px) translateX(0px) scale(1)",
          },
          "50%": {
            transform: "translateY(-50px) translateX(30px) scale(1.05)",
          },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(-5px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionProperty: {
        all: "all",
      },
    },
  },
  plugins: [],
};
