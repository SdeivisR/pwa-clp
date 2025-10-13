/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{html,js,ts,jsx,tsx}',
  ],
  safelist: [
    'text-red-500',
    'text-yellow-500',
    'text-green-500',
    'text-lime-500',
    'text-orange-500',
    'text-green-600'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

