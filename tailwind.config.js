/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#00c5cc",
        "background-main": "#FFFFFF",
        "background-secondary": "#F8F9FA",
        "text-charcoal": "#334155",
        "text-slate": "#475569",
        "border-light": "#E2E8F0",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 2px 10px -2px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}
