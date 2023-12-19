/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  variants: {
    extends: {},
  },
  plugins: [],
};
