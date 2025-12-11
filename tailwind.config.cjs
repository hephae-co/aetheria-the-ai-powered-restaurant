/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#121212',
        'primary': '#1a1a1a',
        'secondary': '#242424',
        'accent': '#d4af37',
        'accent-light': '#e0c26e',
        'text-primary': '#e0e0e0',
        'text-secondary': '#a0a0a0',
        'primary-dark': '#0d0d0d',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in-up': 'slideInUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(212, 175, 55, 0.6)',
      }
    },
  },
  plugins: [],
};