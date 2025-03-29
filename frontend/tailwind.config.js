import daisyui from 'daisyui';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss({
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      darkMode: 'class', // Add this line - it's crucial!
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#eef2ff',
              100: '#e0e7ff',
              200: '#c7d2fe',
              300: '#a5b4fc',
              400: '#818cf8',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              800: '#3730a3',
              900: '#312e81',
              950: '#1e1b4b',
            },
          },
        },
      },
      plugins: [require("daisyui")],
      daisyui: {
        themes: ["light", "dark", "corporate"],
      },
    }),
    autoprefixer(),
  ],
}