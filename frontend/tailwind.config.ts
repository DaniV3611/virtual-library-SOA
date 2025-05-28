// tailwind.config.js
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // habilita modo oscuro por clase
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "float-slow": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
          },
          "50%": {
            transform: "translateY(-20px) rotate(180deg)",
          },
        },
        "float-reverse": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
          },
          "50%": {
            transform: "translateY(20px) rotate(-180deg)",
          },
        },
        "float-diagonal": {
          "0%, 100%": {
            transform: "translate(0px, 0px) rotate(0deg)",
          },
          "25%": {
            transform: "translate(10px, -15px) rotate(90deg)",
          },
          "50%": {
            transform: "translate(-5px, -10px) rotate(180deg)",
          },
          "75%": {
            transform: "translate(-10px, 5px) rotate(270deg)",
          },
        },
        "float-up-down": {
          "0%, 100%": {
            transform: "translateY(0px) scale(1)",
          },
          "50%": {
            transform: "translateY(-30px) scale(1.05)",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            transform: "translate(-50%, -50%) scale(1)",
            opacity: "0.4",
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(1.1)",
            opacity: "0.6",
          },
        },
      },
      animation: {
        "float-slow": "float-slow 8s ease-in-out infinite",
        "float-reverse": "float-reverse 12s ease-in-out infinite",
        "float-diagonal": "float-diagonal 15s ease-in-out infinite",
        "float-up-down": "float-up-down 10s ease-in-out infinite",
        "pulse-slow": "pulse-slow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
