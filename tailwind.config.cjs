/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.svelte"],
  theme: {
    extend: {
      fontFamily: {
        cardo: ["Cardo", "serif"],
      },
    },
  },
  plugins: ["tailwindcss", "autoprefixer"],
};
