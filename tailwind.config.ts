import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          50: "#f8fafc",
          100: "#f1f5f9",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      keyframes: {
        bounceClick: {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(0.92)" },
          "60%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "bounce-click": "bounceClick 0.2s cubic-bezier(0.36, 0, 0.66, -0.56)",
      },
    },
  },
  plugins: [],
};

export default config;
