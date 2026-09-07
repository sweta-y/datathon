/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Light Theme Color Tokens
        void: '#F7FAFC',        // Main body background
        surface: '#FFFFFF',     // Headers & Card surfaces
        panel: '#FFFFFF',       // Panel backgrounds
        border: '#E2E8F0',      // Subtle borders (slate-200)
        muted: '#CBD5E1',       // Muted background bars (slate-300)
        dim: '#64748B',         // Secondary text (slate-500)
        subtle: '#475569',      // Subtitle text (slate-600)
        heading: '#0F172A',     // Primary heading text (slate-900)
        
        // Vibrant Accents Tuned for Light Background Contrast
        violet: {
          DEFAULT: '#0284C7',   // Sky 600
          dim: '#0369A1',       // Sky 700
          glow: 'rgba(2,132,199,0.12)',
        },
        cyan: {
          DEFAULT: '#0EA5E9',   // Sky 500
          dim: '#0284C7',       // Sky 600
          glow: 'rgba(14,165,233,0.12)',
        },
        magenta: {
          DEFAULT: '#E11D48',   // Rose 600
          dim: '#BE123C',       // Rose 700
          glow: 'rgba(225,29,72,0.12)',
        },
        amber: {
          DEFAULT: '#D97706',   // Amber 600
          dim: '#B45309',       // Amber 700
          glow: 'rgba(217,119,6,0.12)',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-void': `
          linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px)
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
