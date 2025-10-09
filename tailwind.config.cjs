/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        choppiesRed: "#cc0000",
        choppiesYellow: "#ffe600",
      },
    },
  },
  plugins: [],
};
