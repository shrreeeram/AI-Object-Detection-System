/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1a2332',
        },
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
      transitionDelay: {
        '1000': '1000ms',
      },
    },
  },
  plugins: [],
}
