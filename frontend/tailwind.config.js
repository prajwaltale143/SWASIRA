/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swasira: {
          teal: {
            DEFAULT: '#0B4F4A',
            dark: '#083B37',
            light: '#136761',
            surface: '#E7F2EE'
          },
          sage: {
            DEFAULT: '#6FAE8B',
            light: '#91C4A9',
            dark: '#4F8A6B'
          },
          saffron: {
            DEFAULT: '#E9A23B',
            light: '#F3BE6D',
            dark: '#C9821F'
          },
          mint: {
            DEFAULT: '#EAF5F0',
            subtle: '#F4FAF7',
            border: '#D0E6DC'
          },
          muted: '#5A6B68',
          charcoal: '#1A2926',
          amber: {
            DEFAULT: '#D97706',
            light: '#FEF3C7',
            border: '#FDE68A',
            dark: '#B45309'
          }
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(11, 79, 74, 0.06), 0 2px 6px -1px rgba(11, 79, 74, 0.04)',
        'premium': '0 10px 30px -5px rgba(11, 79, 74, 0.1), 0 4px 10px -2px rgba(11, 79, 74, 0.05)',
        'glow': '0 0 25px rgba(233, 162, 59, 0.25)',
      }
    },
  },
  plugins: [],
}
