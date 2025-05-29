/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      // You can keep other theme extensions here if you have them
    },
    fontFamily: {
      sans: ['Nunito', 'sans-serif'], // This makes Nunito the default for sans-serif fonts
      // You can still define a specific key if you want to use font-nunito sometimes
      // but if Nunito is your primary sans-serif font, the above is sufficient.
      // nunito: ['Nunito', 'sans-serif'], // You can remove this or keep it if you want both font-sans and font-nunito to work
    },
  },
  plugins: [],
}

