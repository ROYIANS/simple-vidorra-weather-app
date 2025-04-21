/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'white/5': 'rgba(255, 255, 255, 0.05)',
        'white/10': 'rgba(255, 255, 255, 0.1)',
        'white/20': 'rgba(255, 255, 255, 0.2)',
        'white/30': 'rgba(255, 255, 255, 0.3)',
        'white/40': 'rgba(255, 255, 255, 0.4)',
        'white/50': 'rgba(255, 255, 255, 0.5)',
        'white/60': 'rgba(255, 255, 255, 0.6)',
        'white/70': 'rgba(255, 255, 255, 0.7)',
        'white/80': 'rgba(255, 255, 255, 0.8)',
        'white/90': 'rgba(255, 255, 255, 0.9)',
      },
      backdropBlur: {
        md: '12px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}; 