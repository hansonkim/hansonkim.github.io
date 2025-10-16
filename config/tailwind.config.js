/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,njk,md,js}',
    './src/_includes/**/*.{html,njk}',
    './src/_layouts/**/*.{html,njk}'
  ],
  theme: {
    extend: {
      width: {
        '70': '280px',
      },
    },
  },
  plugins: [],
};
