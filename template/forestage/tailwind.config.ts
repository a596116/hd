/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  important: true,
  theme: {
    extend: {
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9'
      },
      colors: {
        hd: {
          primary: 'var(--hd-primary-500)',
          success: 'var(--hd-success)',
          danger: 'var(--hd-danger)',
          warning: 'var(--hd-warning)',
          info: 'var(--hd-info)',
          light: 'var(--hd-light)',
          text: 'var(--hd-text)',
          'text-50': 'var(--hd-text-50)',
          dark: 'var(--hd-dark)',
          'dark-50': 'var(--hd-dark-50)',
          muted: 'var(--hd-muted)',
          white: 'var(--hd-white)',
          'white-50': 'var(--hd-white-50)',
          disable: 'var(--hd-disable)',
          border: 'var(--hd-border)',
          bg: 'var(--hd-bg)',
          'bg-1': 'var(--hd-bg-1)',
          'bg-50': 'var(--hd-bg-50)',
          50: '#c2ffbf',
          100: '#a3d6a0',
          200: '#98c596',
          300: '#8ab088',
          400: '#7d9e7b',
          500: '#739072',
          600: '#658064',
          700: '#576d56',
          800: '#475946',
          900: '#394838',
          950: '#283327',
        },
      },
      animation: {
        move: 'svgMove 5s ',
      },
      keyframes: {
        svgMove: {
          '0%': { strokeDasharray: '0, 600px' },
          '100%': { strokeDasharray: '600px, 0' },
        },
      },
    },
  },
  plugins: [],
}
