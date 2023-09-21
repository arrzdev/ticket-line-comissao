/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: ["dark"],
  },
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  plugins: [require("tailwindcss-animate"), require("daisyui")],
}