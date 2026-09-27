/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#06b6d4",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        navy: {
          900: "#0a0f24",
          800: "#0f172a",
          700: "#1e293b",
        },
        accent: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          electric: "#60a5fa",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(ellipse at top, var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at var(--tw-angle), var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #0a0f24 0%, #1e293b 50%, #0f172a 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(15, 23, 42, 0.45), rgba(10, 15, 36, 0.45))",
      },
      boxShadow: {
        "glass-sm": "0 4px 12px rgba(6, 172, 212, 0.12)",
        glass: "0 8px 32px 0 rgba(6, 172, 212, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        "glass-lg": "0 16px 40px 0 rgba(6, 172, 212, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.07)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
