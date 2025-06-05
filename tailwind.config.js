// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Cambia a 'media' si prefieres el modo oscuro basado en la configuración del sistema
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightBackground: '#ffffff', // Fondo claro
        darkBackground: '#1f2937', // Fondo oscuro
        lightText: '#1f2937', // Texto claro
        darkText: '#d1d5db', // Texto oscuro
        lightCard: '#f3f4f6', // Fondo tarjetas claro
        darkCard: '#374151', // Fondo tarjetas oscuro
        primary: '#2563eb', // Color principal (botones, enlaces)
      }},
  },
  plugins: [require("tailwind-extended-shadows")],
  presets: [require('nativewind/preset')],
};
