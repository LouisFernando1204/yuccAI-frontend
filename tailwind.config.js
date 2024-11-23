/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      poppins: ["Poppins", "sans-serif"]
    },
    colors: {
      dark: '#0c0a09',
      light: '#fafafa',
      primary: '#f97316'
    }
  },
  plugins: [],
}