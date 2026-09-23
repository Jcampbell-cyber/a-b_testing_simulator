/** @type {import('tailwindcss').Config} */
// Colour roles from the design system map onto Tailwind's default palette:
//   gray-900 #111827 page background     gray-800 #1F2937 cards / alternate sections
//   gray-700 #374151 inner panels        gray-600 #4B5563 tertiary panels
//   blue-600 #2563EB buttons             blue-400 #60A5FA links (hover blue-300)
//   emerald-400 #34D399 proof            gray-300 #D1D5DB body, gray-400 #9CA3AF secondary
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        gray: {
          // Used by some of the simulators; sits between gray-700 and gray-800.
          750: '#2B3544',
        },
      },
      maxWidth: {
        site: '80rem',
      },
    },
  },
  plugins: [],
};
