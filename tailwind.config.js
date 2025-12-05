module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000822', // or your primary color
          light: '#000822',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#001040', // or your secondary color
          light: '#001040',
          dark: '#B45309',
        },
      },
    },
  },
  plugins: [],
}