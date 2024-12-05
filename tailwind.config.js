/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a5fb4',
          50: '#eef5ff',
          100: '#d9e9ff',
          200: '#bcd7ff',
          300: '#8ebeff',
          400: '#5899ff',
          500: '#3b82f6',
          600: '#1a5fb4',
          700: '#1e4b8f',
          800: '#1e3f75',
          900: '#1e3563',
        },
        secondary: {
          DEFAULT: '#ccd230',
          light: '#e3e7a1',
        },
        dark: {
          DEFAULT: '#062247',
          50: 'rgba(6, 34, 71, 0.05)',
          100: 'rgba(6, 34, 71, 0.1)',
          500: 'rgba(6, 34, 71, 0.5)',
          900: 'rgba(6, 34, 71, 0.9)',
        }
      },
    },
  },
  plugins: [],
}; 