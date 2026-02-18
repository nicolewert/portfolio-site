/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
        geist: ['var(--font-geist-sans)'],
      },
      colors: {
        light: {
          background: '#dbe5f5', // rgb(219, 229, 245)
          foreground: '#1a2233',
          card: '#f7faff',
          accent: '#b3c7e6',
          primary: '#3b5bdb',
        },
        dark: {
          background: '#1a2233',
          foreground: '#dbe5f5',
          card: '#232b3a',
          accent: '#3b5bdb',
          primary: '#b3c7e6',
        },
      },
      animation: {
        aurora: 'aurora 60s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%',
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}
