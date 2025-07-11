/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
}
