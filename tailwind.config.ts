import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        fox: { DEFAULT: '#E8733A', light: '#FDEEE6', dark: '#C45A24' },
        lav: { DEFAULT: '#A78BFA', light: '#EDE9FE', dark: '#7C5FC7' },
        mint: { DEFAULT: '#34D399', light: '#D1FAE5' },
        peach: '#FDBA74',
        pink: '#F9A8D4',
        cream: '#FFF8F5',
      },
    },
  },
  plugins: [],
} satisfies Config
