/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B8C2E',
        'primary-dark': '#2A6521',
        tertiary: '#2A6521',
        error: '#B11226',
        surface: '#f8fafc',
      },
    },
  },
  plugins: [],
}
