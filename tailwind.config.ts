import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Blue accent - sampled from the reference artwork
        brand: {
          50: "#EFF6FF", 100: "#DBEAFE", 200: "#BFDBFE", 300: "#93C5FD",
          400: "#60A5FA", 500: "#3B82F6", 600: "#2563EB", 700: "#1D4ED8",
          800: "#1E40AF", 900: "#1E3A8A", 950: "#172554",
        },
        // Deep navy surfaces
        ink: {
          50: "#F1F5F9", 100: "#E2E8F0", 200: "#CBD5E1", 300: "#94A3B8",
          400: "#64748B", 500: "#47536B", 600: "#334155", 700: "#1E293B",
          800: "#152238", 900: "#0B1830", 950: "#050B1A",
        },
        whatsapp: { DEFAULT: "#25D366", dark: "#128C7E", deep: "#075E54" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,.35), 0 14px 36px -18px rgba(0,0,0,.7)",
        lift: "0 26px 60px -26px rgba(0,0,0,.85)",
        brand: "0 12px 34px -12px rgba(59,130,246,.5)",
        glow: "0 0 0 1px rgba(59,130,246,.35), 0 20px 48px -18px rgba(59,130,246,.45)",
      },
      keyframes: {
        spinSlow: { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        pulseRing: {
          "0%": { transform: "scale(.85)", opacity: ".55" },
          "70%": { transform: "scale(1.7)", opacity: "0" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "translateY(14px) scale(.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        bubbleIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        haloPulse: {
          "0%,100%": { opacity: ".35", transform: "scale(1)" },
          "50%": { opacity: ".7", transform: "scale(1.04)" },
        },
      },
      animation: {
        "spin-slow": "spinSlow 26s linear infinite",
        "spin-slower": "spinSlow 48s linear infinite reverse",
        marquee: "marquee 34s linear infinite",
        floaty: "floaty 7s ease-in-out infinite",
        "pulse-ring": "pulseRing 2.4s cubic-bezier(.24,.6,.35,1) infinite",
        "pop-in": "popIn .32s cubic-bezier(.2,.8,.3,1) both",
        "bubble-in": "bubbleIn .34s cubic-bezier(.2,.8,.3,1) both",
        halo: "haloPulse 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
