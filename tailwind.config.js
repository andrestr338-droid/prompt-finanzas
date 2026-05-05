/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        surface: '#141420',
        elevated: '#1E1E2E',
        border: '#2A2A3E',
        primary: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        'text-primary': '#F8F8FC',
        'text-secondary': '#94A3B8',
        'text-disabled': '#4A5568',
        destructive: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        modal: '16px',
        chip: '999px',
        hero: '24px',
      },
      animation: {
        'slide-up': 'slideUp 280ms cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in': 'fadeIn 200ms ease-out',
      },
      keyframes: {
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
