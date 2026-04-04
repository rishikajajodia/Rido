/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        bg: '#0a0a0f',
        surface: '#111118',
        surface2: '#1a1a24',
        surface3: '#22222e',
        border: '#2a2a38',
        border2: '#3a3a50',
        accent: '#00d4aa',
        accent2: '#7c3aed',
        accent3: '#f59e0b',
        rtext: '#f0f0ff',
        rtext2: '#9999bb',
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.5s infinite',
        'slide-in': 'slideIn 0.3s ease',
        'pop-in': 'popIn 0.3s ease',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          from: { opacity: '0', transform: 'translateY(-20px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
