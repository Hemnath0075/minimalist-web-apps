module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000D33   ', // or your primary color
          light: '#000D33',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#001965', // or your secondary color
          light: '#001965',
          dark: '#B45309',
        },
      },
    },
  },
  plugins: [],
}