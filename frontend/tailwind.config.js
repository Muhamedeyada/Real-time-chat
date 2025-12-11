import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        yallachat: {
          "primary": "#6366f1",      // Indigo - modern, professional
          "primary-focus": "#4f46e5",
          "primary-content": "#ffffff",
          "secondary": "#8b5cf6",     // Purple - complementary
          "secondary-focus": "#7c3aed",
          "secondary-content": "#ffffff",
          "accent": "#06b6d4",        // Cyan - for highlights
          "accent-focus": "#0891b2",
          "accent-content": "#ffffff",
          "neutral": "#1e293b",       // Slate - for backgrounds
          "neutral-focus": "#0f172a",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",      // White - main background
          "base-200": "#f1f5f9",      // Light slate - subtle backgrounds
          "base-300": "#e2e8f0",      // Border color
          "base-content": "#0f172a",  // Dark text
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      {
        yallachatDark: {
          "primary": "#818cf8",       // Lighter indigo for dark mode
          "primary-focus": "#6366f1",
          "primary-content": "#1e293b",
          "secondary": "#a78bfa",     // Lighter purple
          "secondary-focus": "#8b5cf6",
          "secondary-content": "#1e293b",
          "accent": "#22d3ee",        // Lighter cyan
          "accent-focus": "#06b6d4",
          "accent-content": "#1e293b",
          "neutral": "#334155",       // Darker slate
          "neutral-focus": "#1e293b",
          "neutral-content": "#f1f5f9",
          "base-100": "#0f172a",      // Dark background
          "base-200": "#1e293b",      // Slightly lighter
          "base-300": "#334155",      // Borders
          "base-content": "#f1f5f9",  // Light text
          "info": "#60a5fa",
          "success": "#34d399",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
};
