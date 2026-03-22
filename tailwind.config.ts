import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f6f0",
          100: "#ebeadd",
          200: "#d5d2bf",
          300: "#bcb69a",
          400: "#a19872",
          500: "#8a805a",
          600: "#6f6749",
          700: "#524d39",
          800: "#383427",
          900: "#171610"
        },
        accent: {
          50: "#f0f1ff",
          100: "#e1e4ff",
          200: "#c4c9ff",
          300: "#9ea4ff",
          400: "#7a81f4",
          500: "#5c63ea",
          600: "#4a50d1",
          700: "#3f43b3",
          800: "#363995",
          900: "#2f3177"
        },
        coral: {
          100: "#ffe3d9",
          300: "#ffb99c",
          500: "#f37f55"
        }
      },
      fontFamily: {
        display: ["Aptos Display", "Trebuchet MS", "\"Segoe UI\"", "sans-serif"],
        sans: ["Aptos", "\"Segoe UI\"", "sans-serif"]
      },
      boxShadow: {
        card: "0 18px 40px rgba(17, 22, 14, 0.08)"
      },
      backgroundImage: {
        "paper-grid":
          "linear-gradient(rgba(23, 22, 16, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(23, 22, 16, 0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
