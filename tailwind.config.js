/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      sm: '500px',  // Изменили на 600px
      md: '700px',
      lg: '960px',
      xl: '1600px',
    },
  },
  plugins: [],
}
