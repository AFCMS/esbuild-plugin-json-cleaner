import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  dts: {
    sourcemap: false,
  },
  exports: true,
  sourcemap: false,
  minify: true,
  clean: true,
  platform: "node",
  attw: {
    profile: "esm-only",
  },
  publint: {
    level: "suggestion",
  },
});
