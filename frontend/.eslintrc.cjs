const path = require("path");

module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb",
    "react-app",
    "plugin:import/errors",
    "plugin:jsx-a11y/recommended",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true,
    },
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: [
    "react",
    "import",
    "jsx-a11y",
    "prettier",
    "@typescript-eslint", // ✅ ADDED
  ],

  rules: {
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/label-has-for": "off",
    "prettier/prettier": "error",
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "template-curly-spacing": ["off", "never"],
    "linebreak-style": 0,
    "react/prop-types": 0,
    "no-underscore-dangle": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
    indent: "off",
    quotes: ["error", "double"],
    "comma-dangle": [2, "always-multiline"],
    semi: [2, "always"],
    "no-extra-semi": 2,
    "react/jsx-props-no-spreading": "off",
    "no-param-reassign": 0,
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "arrow-parens": 0,
    "default-param-last": 0,
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "react/function-component-definition": ["off"],
    "react/require-default-props": [
      "off",
      {
        functions: "defaultArguments",
      },
    ],
    camelcase: "off",
    "@typescript-eslint/camelcase": "off",
    "react/no-array-index-key": "off",
  },
  settings: {
    "import/resolver": {
      webpack: {
        config: path.join(__dirname, "webpack.config.ts"),
      },
      node: {
        paths: ["src"],
        moduleDirectory: ["node_modules", "src/"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
