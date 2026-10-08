export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        muted: '#27272a',
        'muted-foreground': '#a1a1aa',
        primary: '#3b82f6',
        'primary-foreground': '#ffffff',
        border: '#27272a',
      }
    },
  },
  plugins: [],
}
