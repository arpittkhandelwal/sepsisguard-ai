/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
          light: '#fee2e2',
          container: '#131b2e'
        },
        surface: {
          DEFAULT: '#fcf8fa',
          glass: 'rgba(255, 255, 255, 0.7)',
          variant: '#e4e2e4',
          bright: '#fcf8fa',
          dim: '#dcd9db'
        },
        "on-surface": "#1b1b1d",
        "on-surface-variant": "#45464d",
        "primary-container": "#131b2e",
        "on-primary-container": "#7c839b",
        secondary: "#505f76",
        "secondary-container": "#d0e1fb",
        error: "#ba1a1a",
        "error-container": "#ffdad6"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "container-margin": "24px",
        gutter: "16px",
      }
    },
  },
  plugins: [],
}
