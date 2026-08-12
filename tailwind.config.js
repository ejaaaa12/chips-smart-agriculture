/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf1",
          100: "#d7f4dd",
          200: "#b0e8bd",
          300: "#7dd794",
          400: "#4cbf6c",
          500: "#2ea34d",
          600: "#1f8a3d",
          700: "#1b6f33",
          800: "#19582b",
          900: "#164825",
          950: "#0b2e14",
        },
        ink: {
          900: "#0f1b14",
          800: "#16241b",
          700: "#1c2e21",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 27, 20, 0.04), 0 1px 8px rgba(15, 27, 20, 0.06)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
