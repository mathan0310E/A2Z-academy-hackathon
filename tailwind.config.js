/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // A2Z Academy brand palette (mirrors the a2zacademy.co.in design tokens)
        brand: {
          green: "#71bf43",
          "green-hover": "#5fa536",
          "green-soft": "#eaf6e1",
          cyan: "#71bf43",
          "cyan-hover": "#5fa536",
          navy: "#1a335a",
          "navy-deep": "#0f2340",
          "navy-soft": "#eaf6e1",
          red: "#d92d20",
          "red-hover": "#b91c1c",
          ink: "#333333",
          "ink-strong": "#1a1a1a",
          muted: "#666666",
          surface: "#f7f7f7",
          white: "#ffffff",
        },
        // shadcn/ui semantic tokens (HSL channel triplets from globals.css).
        // The reference site maps primary -> brand green and accent -> brand ink.
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-puvi)",
          "Puvi",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: ["var(--font-puvi)", "Puvi", "Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(ellipse at top, var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at var(--tw-angle), var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #ffffff 0%, #f7f7f7 55%, #eaf6e1 100%)",
        "brand-gradient": "linear-gradient(135deg, #71bf43 0%, #5fa536 100%)",
        "navy-gradient": "linear-gradient(135deg, #1a335a 0%, #0f2340 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(247, 247, 247, 0.95))",
      },
      boxShadow: {
        "brand-sm": "0 4px 12px rgba(113, 191, 67, 0.15)",
        brand: "0 8px 24px rgba(113, 191, 67, 0.22)",
        "brand-lg": "0 16px 40px rgba(113, 191, 67, 0.28)",
        "glass-sm": "0 4px 12px rgba(15, 35, 64, 0.08)",
        card: "0 4px 24px rgba(15, 35, 64, 0.08)",
        "card-hover": "0 12px 36px rgba(15, 35, 64, 0.14)",
        navy: "0 10px 30px rgba(15, 35, 64, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        brand: "0.5rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
  plugins: [require("tailwindcss-animate")],
};
