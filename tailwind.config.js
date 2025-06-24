module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Roboto'", 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
  variants: {
    extend: {
      backgroundColor: ['dark', 'high-contrast'],
      textColor: ['dark', 'high-contrast'],
      borderColor: ['dark', 'high-contrast']
    },
  },
};