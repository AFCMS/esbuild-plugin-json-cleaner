import { defineConfig } from "oxfmt";

export default defineConfig({
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  insertFinalNewline: true,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  ignorePatterns: ["dist/**", "node_modules/**"],
  sortImports: true,
});
