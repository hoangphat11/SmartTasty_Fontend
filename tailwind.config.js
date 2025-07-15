/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/Screen/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-roboto)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        text: "var(--text-color)",
        "text-title": "var(--text-title-color)",
        button: "var(--button-bg)",
        "button-hover": "var(--button-hover-bg)",
        border: "var(--border-color)",
        "active-bg": "var(--active-bg)",
        link: "var(--link)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
      },
    },
  },
  plugins: [],
};
