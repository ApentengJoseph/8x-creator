/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#22c55e',
          greenDim: '#16a34a',
          bg: '#0a0a0a',
          card: '#111111',
          border: '#1f1f1f',
          muted: '#6b7280',
          text: '#f9fafb',
          textDim: '#9ca3af',
          amber: '#f59e0b',
          red: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};
