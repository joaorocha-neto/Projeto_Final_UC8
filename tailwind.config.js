/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins_400Regular"],
        poppinsMedium: ["Poppins_500Medium"],
        poppinsBold: ["Poppins_700Bold"],
      },
    },
  },
  plugins: [],
}
