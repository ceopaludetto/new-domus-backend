const path = require("path");

const rules = {
  // Prettier for autofix
  "prettier/prettier": "error",
  // Some logic need reassign (such sequelize hooks)
  "no-param-reassign": "off",
  // Allow for of
  "no-restricted-syntax": "off",
  // Import ordering and allow no default
  "import/no-import-module-exports": "off",
  "import/prefer-default-export": "off",
  "import-helpers/order-imports": [
    "warn",
    {
      newlinesBetween: "always",
      groups: ["/^react/", "module", "/^@\\//", ["parent", "sibling", "index"]],
      alphabetize: { order: "asc", ignoreCase: true },
    },
  ],
  "import/extensions": "off",
};

module.exports = {
  env: {
    node: true,
  },
  extends: ["prettier"],
  plugins: ["import-helpers", "prettier"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules,
  overrides: [
    {
      files: ["src/**/*.ts", "mikro-orm.config.ts"],
      env: {
        node: true,
        jest: true,
      },
      extends: ["airbnb-base", "airbnb-typescript/base", "prettier"],
      plugins: ["@typescript-eslint", "import-helpers", "prettier"],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: path.resolve("tsconfig.json"),
      },
      rules: {
        ...rules,
        // DI in Nest
        "no-useless-constructor": "off",
        "class-methods-use-this": "off",
        // Nest dtos
        "max-classes-per-file": ["error", 4],
        // Use inference of type
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        // Allow any in some logic
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-member-accessibility": ["error"],
      },
    },
    {
      files: ["src/models/*.ts"],
      rules: {
        "import/no-cycle": "off",
      },
    },
    {
      files: ["./**/*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
      },
    },
  ],
};
