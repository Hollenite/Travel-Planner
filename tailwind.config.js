/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: '#13131A',
        surface2: '#1C1C27',
        border: '#2A2A38',
        accent: '#6C63FF',
        accent2: '#FF6584',
        accent3: '#43E8D8',
        text: '#F0F0F5',
        muted: '#8888A0',
        success: '#4ADE80',
        warning: '#FBBF24',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        input: '8px',
      },
    },
  },
  plugins: [],
}
