/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // PakComply Design System
        base:     '#F8FAFC',
        surface:  '#FFFFFF',
        elevated: '#F1F5F9',
        border:   '#E2E8F0',
        accent:   '#0F766E',
        'accent-light': '#0D9488',
        'accent-dim':   '#115E59',
        primary:  '#0F172A',
        secondary:'#475569',
        muted:    '#94A3B8',
        success:  '#16A34A',
        warning:  '#D97706',
        danger:   '#DC2626',
        info:     '#0284C7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
      },
      keyframes: {
        pulseRing: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%':      { opacity: 0.4, transform: 'scale(1.08)' },
        },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
