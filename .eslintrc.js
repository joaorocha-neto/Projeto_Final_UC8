module.exports = {
  root: true,
  extends: [
    "@react-native-community",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
  ignorePatterns: ["node_modules/", "babel.config.js", "metro.config.js"],
};
