/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif-sc': ['"Noto Serif SC"', '"Songti SC"', '"STSong"', '"SimSun"', 'serif'],
        'display-sc': ['"STZhongsong"', '"Noto Serif SC"', '"Songti SC"', 'serif'],
        'sans-sc': ['"Microsoft YaHei UI"', '"PingFang SC"', '"Segoe UI"', 'sans-serif'],
        'emoji': ['"Noto Color Emoji"', 'sans-serif'],
      },
      colors: {
        paper: '#f6efe3',
        'paper-soft': '#fbf6ee',
        ink: '#34403e',
        'ink-strong': '#1f2322',
        'ink-soft': '#66706b',
        gold: '#9f6a2f',
        'gold-soft': '#d1b06a',
        green: '#5d7a68',
        'green-soft': '#8da58f',
        red: '#a84a3d',
      },
      backgroundImage: {
        'paper-fade': 'linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0.12))',
        'ink-wash': 'radial-gradient(circle at top left, rgba(93,122,104,0.18), transparent 26%), radial-gradient(circle at top right, rgba(159,106,47,0.12), transparent 18%)',
      },
      boxShadow: {
        paper: '0 20px 60px rgba(38, 33, 22, 0.12)',
        card: '0 16px 40px rgba(48, 41, 28, 0.10)',
      },
      animation: {
        drift: 'drift 10s ease-in-out infinite',
        breathe: 'breathe 2.6s ease-in-out infinite',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.65' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
