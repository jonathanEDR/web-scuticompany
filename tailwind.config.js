/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Habilitar dark mode con clase
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Colores semánticos para dashboard
        dashboard: {
          bg: {
            light: '#FFFFFF',
            dark: '#111827',
          },
          surface: {
            light: '#F9FAFB',
            dark: '#1F2937',
          },
          border: {
            light: '#E5E7EB',
            dark: '#374151',
          },
        },
      },
    },
  },
  plugins: [],
}
