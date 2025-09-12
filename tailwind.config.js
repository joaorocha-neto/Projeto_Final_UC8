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
      colors: {
        azul_senac: "#004A8D",
        azul_claro_senac: "#336699",
        laranja_senac: "#F7941D",
        laranja_claro_senac: "#FDC180",
        laranja_mais_claro_senac: "#FFEFE0",
      },
    },
  },
  plugins: [],
};
