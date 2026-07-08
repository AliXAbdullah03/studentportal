/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './views/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#bcdeff',
          300: '#8ecaff',
          400: '#59adff',
          500: '#3389fc',
          600: '#1d6af1',
          700: '#1555de',
          800: '#1845b4',
          900: '#193d8e',
          950: '#142756',
        },
        accent: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        portal: {
          navy: '#1a3a5c',
          teal: '#0d7377',
          orange: '#e85d04',
          mist: '#f4f5f7',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
