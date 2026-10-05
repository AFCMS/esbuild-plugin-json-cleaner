import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  dts: {
    sourcemap: true,
  },
  exports: true,
  sourcemap: true,
  clean: true,
  platform: "node",
  attw: {
    profile: "esm-only",
  },
  publint: {
    level: "suggestion",
  },
});
