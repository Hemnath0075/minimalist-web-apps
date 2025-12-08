module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'max-h-750': { 'raw': '(max-height: 750px)' }, 
        'min-h-750': { 'raw': '(min-height: 750px)' }, 
      },
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
        yellow:{
          DEFAULT:'#DEC20E'
        },
        green:{
          DEFAULT: '#00E03C'
        },
        red:{
          DEFAULT: '#EB2400'
        },
        cardgreen:{
          DEFAULT: '#068026'
        },
        statusGreen:{
          DEFAULT: '#004B23'
        },
        statusYellow:{
          DEFAULT: '#C86400'
        },
        statusRed:{
          DEFAULT: '#6A040F'
        },
        cardorange:{
          DEFAULT: '#C86400'
        },
        cardred:{
          DEFAULT: '#B71F04'
        },
        containergreen:{
          DEFAULT: '#0B343C'
        },
      },
    },
  },
  plugins: [],
}