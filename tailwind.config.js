/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'max-560': { 'max': '560px' }, // applies when screen width is ≤ 1400px
        'max-340': { 'max': '340px' }, // applies when screen width is ≤ 1400px
        'max-1000': { 'max': '1000px' }, // applies when screen width is ≤ 1400px
      },
    },
  },
  plugins: [],
}
