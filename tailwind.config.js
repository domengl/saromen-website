/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        saromen: {
          black: "#0f0d0b",
          panel: "#181512",
          gold: "#c8a26f",
          cream: "#f7efe2",
          beige: "#ead9c0"
        }
      },
      boxShadow: {
        glow: "0 24px 58px rgba(0,0,0,0.55)"
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["Manrope", "sans-serif"]
      }
    }
  },
  plugins: []
};
