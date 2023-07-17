// ESLint configuration file
//
// Reference: https://eslint.org/docs/latest/use/configure/configuration-files

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "standard-with-typescript",
    "plugin:react/recommended",
    // Added to disable the error "react/react-in-jsx-scope"
    // Reference: https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
    "plugin:react/jsx-runtime",
    // Sets up recommended Prettier settings fir ESLint
    // It combines both eslint-config-prettier and eslint-plugin-prettier
    // Reference: https://prettier.io/docs/en/integrating-with-linters.html
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "tsconfig.json",
  },
  plugins: ["react"],
  rules: {},
  settings: {
    react: {
      version: "detect",
    },
  },
};
