module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FBF5F9', // or your primary color
          light: '#FBF5F9',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#F59E0B', // or your secondary color
          light: '#FBBF24',
          dark: '#B45309',
        },
      },
    },
  },
  plugins: [],
}