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
      dark: '#252525',
      light: '#fafafa',
      primary: '#f0843c'
    }
  },
  plugins: [],
}