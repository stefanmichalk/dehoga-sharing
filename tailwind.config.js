/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3F2F6D',
          light: '#524589',
          dark: '#2C1F4D'
        },
        accent: {
          DEFAULT: '#FF2AAD',
          light: '#FF54BD',
          dark: '#D91B8E'
        },
        white: '#FFFFFF'
      }
    },
  },
  plugins: [],
}
