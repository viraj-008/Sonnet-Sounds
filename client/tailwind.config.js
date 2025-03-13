/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        anton: ["Anton", "sans-serif"],
        stencil: ["Big Shoulders Stencil", "sans-serif"],
        josefin: ["Josefin Sans", "sans-serif"],
        kanit: ["Kanit", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};

