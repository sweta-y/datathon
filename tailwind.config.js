/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#000000',
        surface: '#0A0A0A',
        panel: '#111111',
        border: '#1C1C1C',
        muted: '#2A2A2A',
        dim: '#444444',
        subtle: '#888888',
        violet: {
          DEFAULT: '#7C5CFF',
          dim: '#4B38A8',
          glow: 'rgba(124,92,255,0.15)',
        },
        cyan: {
          DEFAULT: '#22F0D8',
          dim: '#15917F',
          glow: 'rgba(34,240,216,0.15)',
        },
        magenta: {
          DEFAULT: '#FF4FD8',
          dim: '#992F81',
          glow: 'rgba(255,79,216,0.15)',
        },
        amber: {
          DEFAULT: '#FFB84D',
          dim: '#996E2E',
          glow: 'rgba(255,184,77,0.15)',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-void': `
          linear-gradient(rgba(124,92,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,92,255,0.04) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid-void': '32px 32px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'blink': 'blink 1.2s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
