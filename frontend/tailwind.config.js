/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        silver: '#C0C0C0',
        salon: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
      },
      keyframes: {
        'glow-text': {
          '0%, 100%': {
            backgroundImage: 'linear-gradient(to right, #fbbf24, #f97316)', // amber → orange
          },
          '50%': {
            backgroundImage: 'linear-gradient(to right, #ffffff, #ffffff)', // white
          },
        },
        'glow-underline': {
          '0%, 100%': {
            backgroundImage: 'linear-gradient(to right, #fbbf24, #f97316)', // amber → orange
            transform: 'scaleX(1)',
            opacity: '1',
          },
          '50%': {
            backgroundImage: 'linear-gradient(to right, #ffffff, #ffffff)', // white
            transform: 'scaleX(0.6)',
            opacity: '0.6',
          },
        },
      },
      animation: {
        'glow-text': 'glow-text 4s ease-in-out infinite',
        'glow-underline': 'glow-underline 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
