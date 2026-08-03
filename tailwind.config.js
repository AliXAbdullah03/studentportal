/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './views/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep ocean teal system (replaces purple)
        brand: {
          50: '#eef8f8',
          100: '#d5eff0',
          200: '#aedfe2',
          300: '#79c6cc',
          400: '#45a4ae',
          500: '#2b8894',
          600: '#226f7a',
          700: '#1f5a63',
          800: '#1e4a52',
          900: '#0b3d42',
          950: '#06262a',
        },
        // Coral accent (replaces yellow/gold)
        accent: {
          400: '#ff8a72',
          500: '#e85d4c',
          600: '#d04535',
          700: '#ae3629',
        },
        ink: {
          DEFAULT: '#0b3d42',
          soft: '#1f5a63',
          muted: '#5d7d82',
        },
        // Keep token name `gold` for existing classes; value is coral
        gold: {
          DEFAULT: '#e85d4c',
          soft: '#ffc2b5',
          deep: '#d04535',
        },
        sand: '#f4f1eb',
        mist: '#eef6f6',
        portal: {
          navy: '#0b3d42',
          teal: '#226f7a',
          orange: '#e85d4c',
          mist: '#eef6f6',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(11, 61, 66, 0.18)',
        nav: '0 8px 30px rgba(11, 61, 66, 0.22)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        marquee: 'marquee 35s linear infinite',
      },
    },
  },
  plugins: [],
};
