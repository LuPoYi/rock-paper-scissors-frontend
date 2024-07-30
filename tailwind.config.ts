import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        beacon: {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.35)' },
          '100%': { boxShadow: '0 0 0 2rem transparent' },
        },
      },
      animation: {
        beacon: 'beacon 1s infinite linear',
      },
      animationDelay: {
        '0': '0s',
        '1': '0.2s',
        '2': '0.3s',
      },
    },
  },
  plugins: [require('daisyui')],
}
export default config
