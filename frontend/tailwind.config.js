/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0D0B0A', paper: '#F9F5EF', cream: '#EDE8DF', sand: '#D4C9B8',
        terracotta: '#C4664A', coral: '#E07B5A', gold: '#C9993A',
        sage: '#6B8C6E', dusk: '#7B6EA0', mist: '#8B9BAE', pin: '#E84545',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
