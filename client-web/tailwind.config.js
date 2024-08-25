/** @type {import('tailwindcss').Config} */

export const content = [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './**/*.{ts,tsx}',
  './src/**/*.{ts,tsx}',
];

const colors = {
  primary: {
    50: '#D5E4F0',
    100: '#AAC8E1',
    200: '#80ADD2',
    300: '#5691C2',
    400: '#2B76B3',
    DEFAULT: '#015aa4',
    600: '#014B89',
    700: '#013C6D',
    800: '#012D52',
    900: '#001E37',
  },
  secondary: {
    50: '#DDDCDB',
    100: '#BBB8B8',
    200: '#999594',
    300: '#777270',
    400: '#554E4D',
    DEFAULT: '#332B29',
    600: '#2B2422',
    700: '#221D1B',
    800: '#1A1615',
    900: '#110E0E',
  },
  // ===================== Fim =====================
  neutral: {
    50: '#F5F5F5',
    100: '#E0E0E0',
    200: '#C2C2C2',
    DEFAULT: '#858585',
    800: '#292929',
    900: '#0A0A0A',
  },
};

export const theme = {
  container: {
    center: true,
    padding: '2rem',
  },
  extend: {
    colors: {
      ...colors,
    },

    fontFamily: {
      ubuntu: ['"Ubuntu"'],
    },
  }
};

import tailwindcssAnimate from 'tailwindcss-animate';

export const plugins = [tailwindcssAnimate];