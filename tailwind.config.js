/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EBF0FF',
          100: '#D6E0FF',
          200: '#ADC1FF',
          300: '#85A2FF',
          400: '#5C83FF',
          500: '#0033CC',
          600: '#002DB3',
          700: '#002699',
          800: '#001F80',
          900: '#001966',
        },
      },
    },
  },
  plugins: [],
}
