const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // fontSize: {
    //   xs: ['0.75rem', {lineHeight: '1rem'}],
    //   sm: ['0.875rem', {lineHeight: '1.5rem'}],
    //   base: ['1rem', {lineHeight: '1.5rem'}],
    //   lg: ['1.125rem', {lineHeight: '2rem'}],
    //   xl: ['1.25rem', {lineHeight: '1.75rem'}],
    //   '2xl': ['1.5rem', {lineHeight: '2rem'}],
    //   '3xl': ['2rem', {lineHeight: '3rem'}],
    //   '4xl': ['2.5rem', {lineHeight: '3rem'}],
    //   '5xl': ['3rem', {lineHeight: '1'}],
    //   '6xl': ['3.75rem', {lineHeight: '1'}],
    //   '7xl': ['4.5rem', {lineHeight: '1'}],
    //   '8xl': ['6rem', {lineHeight: '1'}],
    //   '9xl': ['8rem', {lineHeight: '1'}],
    // },
    extend: {
      fontSize: {
        tiny: ['0.70rem', {lineHeight: '1rem'}],
      },
      fontFamily: {
        // sans: ['Inter', ...defaultTheme.fontFamily.sans],
        sans: ['Raleway', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#cb2229",
        secondary1: "#78a5a6",
        secondary2: "#4a7077",
        secondary3: "#0f686a",
        secondary4: "#666",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}
