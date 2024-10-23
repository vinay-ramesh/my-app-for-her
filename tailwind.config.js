/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    screens: {
      sm: { max: '426px' },
      // => @media (min-width: 640px and max-width: 767px) { ... }

      md: { min: '426px', max: '768px' },
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      lg: { min: '769px', max: '1024px' },
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      xl: { min: '1025px', max: '1440px' },
      // => @media (min-width: 1280px and max-width: 1535px) { ... }

      '2xl': { min: '1441px' },
      // => @media (min-width: 1536px) { ... }
    },
    colors: {
      white: '#FFFFFF',
      black: '#000000',
      gray: {
        25: '#FCFCFD',
        50: '#F9FAFB',
        100: '#F2F4F7',
        200: '#EAECF0',
        300: '#D0D5DD',
        400: '#98A2B3',
        500: '#667085',
        600: '#475467',
        700: '#344054',
        800: '#1D2939',
        900: '#101828',
      },
      primary: {
        25: '#E0F7F9',
        50: '#EBF5FF',
        100: '#E1EFFE',
        200: '#4FDAE6',
        300: '#23D1DF',
        400: '#1AAAB6',
        500: '#3F83F8',
        600: '#10676E',
        700: '#0C4D53',
        800: '#1E429F',
        900: '#052124',
      },
      secondary: {
        25: '#FCFAFF',
        50: '#EDE1D1',
        100: '#E6D3BD',
        200: '#DEC5A7',
        300: '#D6B691',
        400: '#CDA87B',
        500: '#C59965',
        600: '#AD7C41',
        700: '#825D31',
        800: '#573E21',
        900: '#291D0F',
      },
      error: {
        25: '#FFFBFA',
        50: '#FEF3F2',
        100: '#FEE4E2',
        200: '#FECDCA',
        300: '#FDA29B',
        400: '#F97066',
        500: '#F04438',
        600: '#D92D20',
        700: '#B42318',
        800: '#912018',
        900: '#7A271A',
      },
      warning: {
        25: '#FFFCF5',
        50: '#FFFAEB',
        100: '#FEF0C7',
        200: '#FEDF89',
        300: '#FEC84B',
        400: '#FDB022',
        500: '#F79009',
        600: '#DC6803',
        700: '#B54708',
        800: '#93370D',
        900: '#7A2E0E',
      },
      success: {
        25: '#F6FEF9',
        50: '#ECFDF3',
        100: '#D1FADF',
        200: '#A6F4C5',
        300: '#6CE9A6',
        400: '#32D583',
        500: '#12B76A',
        600: '#039855',
        700: '#027A48',
        800: '#05603A',
        900: '#054F31',
      },
      indigo: {
        800: '#42389D',
      },
    },

    fontFamily: {
      inter: ['Inter', 'sans-seriff'],
    },
    fontSize: {
      xxxs: ['0.5rem', { lineHeight: '0.5rem' }],
      xxs: ['0.625rem', { lineHeight: '0.75rem' }],
      xs: ['0.75rem', { lineHeight: '1.125rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      md: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.875rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
      '5xl': ['3rem', { lineHeight: '3.75rem', letterSpacing: '-0.02em' }],
      '6xl': ['3.75rem', { lineHeight: '4.625rem', letterSpacing: '-0.02em' }],
      '7xl': ['4.5rem', { lineHeight: '5.625rem', letterSpacing: '-0.02em' }],
    },

    boxShadow: {
      xs: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      sm: ['0px 1px 2px 0px rgba(16, 24, 40, 0.06)', '0px 1px 3px 0px rgba(16, 24, 40, 0.1)'],
      md: ['0px 2px 4px -2px rgba(16, 24, 40, 0.06)', '0px 4px 8px -2px rgba(16, 24, 40, 0.1)'],
      lg: ['0px 4px 6px -2px rgba(16, 24, 40, 0.03)', '0px 12px 16px -4px rgba(16, 24, 40, 0.08)'],
      xl: ['0px 8px 8px -4px rgba(16, 24, 40, 0.03)', '0px 20px 24px -4px rgba(16, 24, 40, 0.08)'],
      '2xl': '0px 24px 48px -12px rgba(16, 24, 40, 0.18)',
      '3xl': '0px 32px 64px -12px rgba(16, 24, 40, 0.14)',
    },
    blur: {
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '40px',
    },

    extend: {
      transitionDuration: {
        t2000: '0.6s',
      },
      width: {
        sideBarMobileWidth: '80vw',
        w80: '80%',
        w22: '22%',
        w44: '44%',
        w86: '86.5%',
        w66: '66%',
        w88: '88%',
        w95: '95%',
        w845: '84.5%',
      },
      height: {
        h31: '31rem',
        h27: '27rem',
        fit: 'fit-content',
        h192: '12rem',
        h70v: '70vh',
        halfscreen: '50vh',
        h90v: '90vh',
      },
      padding: {
        '5px': '5px',
        w13p: '13%',
      },
      minWidth: {
        sideBarMobileMinWidth: '265px',
      },
      maxWidth: {
        sideBarMobileMaxWidth: 'calc(100vw- 50px)',
      },
      inset: {
        w15: '15%',
        l206: '2.6%',
      },
    },
  },
  plugins: [require('flowbite/plugin'), './node_modules/tailwind-datepicker-react/dist/**/*.js'],
};
