/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charte graphique Bricol
        'bricol-blue': '#1C4488',
        'bricol-green': '#5EC439',
        'bricol-orange': '#FF9800',
        'bricol-red': '#D32F2F',
        'bricol-gray-light': '#F5F5F5',
        'bricol-gray-dark': '#666666',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
