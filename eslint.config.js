// @ts-check

import jsLint from "@eslint/js";
import vitestPlugin from "@vitest/eslint-plugin";
import commentsPlugin from "eslint-plugin-eslint-comments";
import importPlugin from "eslint-plugin-import";
import prettierRecommendedConfig from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import { configs as tsLintConfigs } from "typescript-eslint";

export default defineConfig(
  jsLint.configs.recommended,
  tsLintConfigs.recommendedTypeChecked,
  prettierRecommendedConfig,
  reactPlugin.configs.flat.recommended,
  reactHooksPlugin.configs.flat["recommended-latest"],
  reactRefreshPlugin.configs.recommended,
  {
    files: ["*.ts", "*.tsx"],
  },
  {
    ignores: ["**/dist/", "src/gen/contracts/"],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.js"],
          defaultProject: "./tsconfig.json",
        },
        sourceType: "module",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "tsconfig.json",
        },
      },
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    plugins: {
      "@vitest": vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs["legacy-recommended"].rules,
    },
  },
  {
    plugins: {
      "eslint-comments": commentsPlugin,
    },
    rules: {
      "eslint-comments/disable-enable-pair": "error",
      "eslint-comments/no-aggregating-enable": "error",
      "eslint-comments/no-duplicate-disable": "error",
      "eslint-comments/no-unlimited-disable": "error",
      "eslint-comments/no-unused-enable": "error",
      "eslint-comments/no-unused-disable": "error",
    },
  },
  {
    files: ["*", "!**/scripts/**/*"],
    rules: {
      "no-console": "warn",
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/extensions": [
        "error",
        "always",
        {
          ignorePackages: true,
          checkTypeImports: true,
        },
      ],
      "import/no-unresolved": [
        "error",
        {
          ignore: ["^[^./]"],
        },
      ],
    },
  },
  {
    rules: {
      "no-alert": "error",
      "prefer-const": "error",
      "default-case": "error",
      "eol-last": "error",
      "object-shorthand": "error",
      "require-atomic-updates": "error",
      "no-unused-private-class-members": "warn",
      "no-promise-executor-return": "error",
      "no-unmodified-loop-condition": "warn",
      eqeqeq: ["error", "smart"],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "no-duplicate-imports": [
        "error",
        {
          includeExports: true,
        },
      ],
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
        },
      ],
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: [
            "const",
            "let",
            "var",
            "directive",
            "import",
            "function",
            "class",
            "block",
            "block-like",
            "multiline-block-like",
          ],
          next: "*",
        },
        {
          blankLine: "any",
          prev: ["import"],
          next: ["import"],
        },
        {
          blankLine: "any",
          prev: ["directive"],
          next: ["directive"],
        },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        {
          blankLine: "always",
          prev: ["multiline-const", "multiline-let"],
          next: "*",
        },
      ],
    },
  },
);
