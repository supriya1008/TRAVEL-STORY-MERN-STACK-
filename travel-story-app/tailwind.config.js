/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#00c6ff", // Corrected hex color
        secondary: "#EF862E",
      },
      backgroundImage: {
        'login-bg-img': "url('./src/assets/images/login.webp')",
      },
    },
  },
  plugins: [],
}
