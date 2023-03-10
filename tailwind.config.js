const { fontFamily } = require("tailwindcss/defaultTheme")
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["pages/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1360px",
      },
    },
    minHeight: {
      '1/2': '50vh',
      '3/4': '75vh',
      '80vh': '80vh'
    },
    maxHeight: {
      '3/4': '75vh',
      '80vh': '80vh'
    },
    boxShadow: {
      "cool-white-border-and-shadow": "rgb(255 255 255 / 20%) 0px 0px 0px 0.5px inset",
      "cool-black-border-and-shadow": "rgb(0 0 0 / 20%) 0px 0px 0px 0.5px inset",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
