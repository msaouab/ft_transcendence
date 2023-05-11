const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
});

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // colors: {
    //   transparent: "transparent",
    //   current: "currentColor",
    //   black: "#000",
    //   white: "#fff",
    //   mygray: '#808080',
    //   bggray: '#b4b4b460',
    // },
    extend: {},
  },
  plugins: [],
}