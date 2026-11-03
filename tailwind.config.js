/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        melfis: {
          cream: '#FAF7F2',
          blush: '#FDF2F4',
          pink: '#E892A2',
          roseDark: '#A84358',
          emerald: '#1C3F3A',
          sage: '#4A6B62',
          dark: '#1A1818',
          gold: '#C5A059',
          goldLight: '#E8D5AB',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(225, 29, 72, 0.08)',
        'luxury': '0 20px 40px -15px rgba(28, 63, 58, 0.12)',
        'float': '0 15px 35px -5px rgba(0, 0, 0, 0.1), 0 5px 15px -3px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
