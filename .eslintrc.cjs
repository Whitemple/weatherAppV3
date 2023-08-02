module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  globals: {
    ymaps: true,
  },
  extends: ["airbnb-base", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["jest"],
  rules: {
    "import/prefer-default-export": "off",
    "max-len": [
      "error",
      {
        ignoreComments: true,
        ignoreUrls: true,
      },
    ],
    "import/extensions": [0, { js: "always" }],
    "no-unused-expressions": ["error", { allowShortCircuit: true }],
  },
};
