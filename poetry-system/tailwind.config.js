/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif-sc': ['"Noto Serif SC"', 'serif'],
        'emoji': ['"Noto Color Emoji"', 'sans-serif'],
      },
      colors: {
        'poetry-gold': '#D4AF37',
        'poetry-cyan': '#00CED1',
        'poetry-dark': '#18181b',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
