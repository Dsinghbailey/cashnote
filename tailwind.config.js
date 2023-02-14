/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
],
  theme: {
    colors: {
      'blue': '#207bea',
      'blue-dark': '#1e6ed2',
      'red': '#f44336',
      'green': '#3f9f7e',
      'white': '#ffffff',
      'grey': '#e0e0e0',
      'grey-dark': '#666666',
      'brown':" #222c3b",
      'black': '#000000',
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {},
  },
  plugins: [],
}