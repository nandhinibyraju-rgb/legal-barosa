/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0646A8",
          deepBlue: "#062D78",
          brightBlue: "#078BE8",
          cyan: "#12B9F2",
          gold: "#F9B800",
          deepGold: "#E99A00",
          dark: "#05070D",
          darkSecondary: "#0A101C",
          purple: "#7b39fc",
          darkPurple: "#2b2344",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        manrope: ['Manrope', 'sans-serif'],
        cabin: ['Cabin', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        telugu: ['"Noto Sans Telugu"', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
// Final submission update
