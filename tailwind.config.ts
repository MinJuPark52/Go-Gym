import type { Config } from 'tailwindcss';
import type { PluginAPI } from 'tailwindcss/types/config';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      keyframes: {
        'slide-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'slide-down': 'slide-down 0.4s ease forwards',
      },
    },
  },
  plugins: [
    function ({ addComponents }: PluginAPI) {
      addComponents({
        'input[type="number"]::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          margin: '0',
        },
        'input[type="number"]::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: '0',
        },
        'input[type="number"]': {
          '-moz-appearance': 'textfield',
        },
      });
    },
    require('tailwind-scrollbar-hide'),
  ],
} satisfies Config;
