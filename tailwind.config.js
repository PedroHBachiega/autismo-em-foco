/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Importante: isso habilita o dark mode baseado em classe
    theme: {
      extend: {},
    },
    plugins: [],
  };