module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#001965', // or your primary color
          light: '#001965',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#00308F', // or your secondary color
          light: '#00308F',
          dark: '#B45309',
        },
      },
    },
  },
  plugins: [],
}