/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-text': '#1C2833',
        'golden': '#E3A831',
        'light-golden': '#FAD623',
        'bg-main': '#F8F9FA'
      },
    },
  },
  plugins: [],
}

