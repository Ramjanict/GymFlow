import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF5722",
          50: "#FFF5F2",
          100: "#FFE8E0",
          200: "#FFD0C2",
          300: "#FFA891",
          400: "#FF7B54",
          500: "#FF5722",
          600: "#F44312",
          700: "#D32F06",
          800: "#A82403",
          900: "#751902",
        },
        accent: {
          amber: "#F59E0B",
          emerald: "#10B981",
          cyan: "#06B6D4",
          violet: "#8B5CF6",
          rose: "#F43F5E",
        },
        dark: {
          950: "#090D16",
          900: "#0D1322",
          850: "#11182B",
          800: "#172036",
          750: "#1E2945",
          700: "#273456",
        },
        sidebar: "#0B0F19",
        background: "#080B11",
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-orange": "0 0 35px -5px rgba(255, 87, 34, 0.35)",
        "glow-amber": "0 0 35px -5px rgba(245, 158, 11, 0.35)",
        "glow-emerald": "0 0 35px -5px rgba(16, 185, 129, 0.35)",
        "glow-violet": "0 0 35px -5px rgba(139, 92, 246, 0.35)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "inner-glow": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
      },
      keyframes: {
        "shimmer": {
          "100%": { "transform": "translateX(100%)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "shimmer": "shimmer 2.5s infinite",
        "float": "float 4s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
