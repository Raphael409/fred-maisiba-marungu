/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#23282A',
          dark: '#16191A',
          light: '#3A4244',
        },
        secondary: {
          DEFAULT: '#1F3847',
          dark: '#152732',
          light: '#2C4E63',
        },
        accent: {
          DEFAULT: '#F45A22',
          dark: '#D8481A',
          light: '#FF7D4D',
        },
        sky: '#2C4E63',
        success: '#2FAE6E',
        neutral: {
          dark: '#23282A',
          muted: '#666666',
          bg: '#F5F5F5',
          border: '#E4E4E4',
          'bg-dark': '#16191A',
          'on-dark': '#FFFFFF',
          'on-dark-muted': '#B7BDBF',
        },
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #16191A 0%, #23282A 55%, #1F3847 100%)',
        'gradient-cta': 'linear-gradient(120deg, #152732 0%, #1F3847 50%, #23282A 100%)',
        'gradient-card': 'linear-gradient(160deg, rgba(244,90,34,0.10) 0%, rgba(35,40,42,0.03) 100%)',
      },
      fontFamily: {
        heading: ['Poppins', 'Montserrat', 'sans-serif'],
        body: ['Inter', 'Lato', 'sans-serif'],
        accent: ['Playfair Display', 'serif'],
      },
      fontSize: {
        'display': 'clamp(2.25rem, 5vw, 3.5rem)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      height: {
        'header': '80px',
        'header-mobile': '64px',
      },
      minHeight: {
        'hero': '90vh',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(35,40,42,0.10)',
        'card-hover': '0 14px 36px rgba(35,40,42,0.20)',
        'glow': '0 8px 32px rgba(244,90,34,0.35)',
        'float': '0 20px 50px rgba(22,25,26,0.22)',
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-slow-delay': 'floatSlow 6s ease-in-out 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scroll-ticker': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.3333%)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
}