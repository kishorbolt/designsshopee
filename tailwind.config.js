/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5A1F',
          yellow: '#FFC400',
          dark: '#101010',
          darker: '#0B0B0C',
          light: '#FFFFFF',
          soft: '#F7F7F7',
          gray: '#EFEFEF',
          muted: '#6B7280',
          subtle: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Cabinet Grotesk', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'premium': '0 10px 30px -5px rgba(16, 16, 16, 0.08), 0 4px 12px rgba(255, 90, 31, 0.05)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 14px 34px rgba(255, 90, 31, 0.12), 0 4px 12px rgba(0,0,0,0.06)',
        'floating': '0 8px 30px rgba(0,0,0,0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        }
      }
    },
  },
  plugins: [],
}

