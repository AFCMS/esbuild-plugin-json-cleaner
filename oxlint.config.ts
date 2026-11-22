import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    typeAware: true,
  },
  rules: {
    "oxc/no-barrel-file": "error",
    "import/extensions": ["error", { checkTypeImports: true, ignorePackages: true }],
    "unicorn/prefer-node-protocol": "error",
  },
});
