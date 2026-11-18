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
          // Playful premium palette inspired by reference
          green: '#075B43',        // Deep forest green
          'green-dark': '#044230', // Extra deep forest green
          'green-light': '#0B7657',// Lighter forest green
          cream: '#FFF8D9',        // Warm cream
          'cream-soft': '#FDFBF0', // Soft warm cream
          'cream-light': '#FFFDF5',// Ultra light cream
          orange: '#FF5638',       // Coral orange for primary buttons
          'orange-hover': '#E04427',
          yellow: '#F5D928',       // Sunny yellow for playful highlights
          'yellow-light': '#FCE96A',
          dark: '#202820',         // Dark text
          muted: '#526052',        // Muted text
          subtle: '#859685',       // Subtle border / text
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Cabinet Grotesk', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(7, 91, 67, 0.05)',
        'premium': '0 10px 30px -5px rgba(7, 91, 67, 0.12), 0 4px 12px rgba(255, 86, 56, 0.06)',
        'card': '0 4px 20px rgba(7, 91, 67, 0.06)',
        'card-hover': '0 14px 34px rgba(7, 91, 67, 0.14), 0 4px 12px rgba(255, 86, 56, 0.08)',
        'floating': '0 8px 30px rgba(4, 66, 48, 0.22)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
        'float-slow': 'floatSlow 4s infinite ease-in-out',
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
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
