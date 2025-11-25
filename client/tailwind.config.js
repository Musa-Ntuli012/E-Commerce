/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ubuntu Sunset Color Scheme
        primary: {
          DEFAULT: '#E87722', // Vibrant Orange
          dark: '#C45E10',
          light: '#FFE5D4',
        },
        secondary: {
          DEFAULT: '#2C5F2D', // Forest Green
          dark: '#1A3A1B',
          light: '#E8F5E9',
        },
        neutral: {
          background: '#FFFFFF',
          surface: '#F8F9FA',
          'surface-dark': '#E9ECEF',
          border: '#DEE2E6',
          'text-primary': '#212529',
          'text-secondary': '#6C757D',
          'text-muted': '#ADB5BD',
        },
        accent: {
          info: '#0EA5E9',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          gold: '#FFD700',
        },
        // Legacy support
        border: '#DEE2E6',
        input: '#DEE2E6',
        ring: '#E87722',
        background: '#FFFFFF',
        foreground: '#212529',
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F8F9FA',
          foreground: '#6C757D',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#212529',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        '6xl': ['3.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '2xl': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'xl': ['1.25rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.1em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'sm': '0.25rem',   // 4px
        'md': '0.5rem',    // 8px
        'lg': '0.75rem',   // 12px
        'xl': '1rem',      // 16px
        '2xl': '1.5rem',   // 24px
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'primary': '0 10px 25px -5px rgba(232, 119, 34, 0.3)',
        'primary-lg': '0 15px 30px -5px rgba(232, 119, 34, 0.4)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'elastic': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}

