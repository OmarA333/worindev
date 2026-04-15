/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        // Worindev brand colors from logo
        brand: {
          blue:      '#1a3a6b',   // dark blue (text)
          'blue-mid':'#2563a8',   // medium blue (W left)
          green:     '#5aaa2a',   // green (W right)
          cyan:      '#00d4ff',   // glow center
          gray:      '#4a5568',   // subtitle gray
        },
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563a8',
          600: '#1d4ed8',
          700: '#1a3a6b',
          800: '#1e3a5f',
          900: '#172554',
        },
        accent: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          400: '#4ade80',
          500: '#5aaa2a',
          600: '#16a34a',
          700: '#15803d',
        },
        dark: {
          900: '#0a0f1e',
          800: '#111827',
          700: '#1f2937',
          600: '#374151',
        },
        // Tema claro para sesión autenticada
        surface: {
          bg:      '#f0f4f8',   // fondo principal gris azulado suave
          card:    '#ffffff',   // cards blancas
          sidebar: '#1a2744',   // sidebar azul oscuro
          border:  '#dde3ed',   // bordes suaves
        },
        ink: {
          900: '#1a2744',   // títulos
          700: '#374151',   // texto normal
          500: '#6b7280',   // texto secundario
          300: '#9ca3af',   // placeholders
        }
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        matchPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(90,170,42,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(90,170,42,0)' },
        }
      },
      animation: {
        'fade-in-up':  'fadeInUp 0.6s ease forwards',
        'fade-in':     'fadeIn 0.4s ease forwards',
        'slide-left':  'slideInLeft 0.5s ease forwards',
        'pulse2':      'pulse2 2s ease-in-out infinite',
        'shimmer':     'shimmer 2s infinite',
        'float':       'float 3s ease-in-out infinite',
        'match-pulse': 'matchPulse 2s ease-in-out infinite',
      }
    }
  },
  plugins: [],
}
