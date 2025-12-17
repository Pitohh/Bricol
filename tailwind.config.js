export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bricol-blue': '#1C4488',
        'bricol-green': '#5EC439',
        'bricol-orange': '#FF9800',
        'bricol-red': '#D32F2F',
        'bricol-gray-light': '#F5F5F5',
        'bricol-gray-dark': '#666666',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
