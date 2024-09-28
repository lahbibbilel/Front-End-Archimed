/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Assurez-vous que Tailwind purgera les styles inutilisés dans ces fichiers
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
