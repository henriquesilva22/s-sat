/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800', // Laranja principal (estilo MercadoLivre)
          600: '#f57c00',
          700: '#e65100',
          800: '#d84315',
          900: '#bf360c',
        },
        secondary: {
          50: '#f3e5f5',
          100: '#e1bee7',
          200: '#ce93d8',
          300: '#ba68c8',
          400: '#ab47bc',
          500: '#9c27b0',
          600: '#8e24aa',
          700: '#7b1fa2',
          800: '#6a1b9a',
          900: '#4a148c',
        },
        success: {
          50: '#e8f5e8',
          100: '#c8e6c9',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
        },
        warning: {
          50: '#fffde7',
          100: '#fff9c4',
          500: '#ffeb3b',
          600: '#fdd835',
          700: '#f9a825',
        },
        error: {
          50: '#ffebee',
          100: '#ffcdd2',
          500: '#f44336',
          600: '#e53935',
          700: '#d32f2f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}