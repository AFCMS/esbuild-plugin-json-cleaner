import { defineConfig } from "tsdown";

export default defineConfig({
  dts: {
    sourcemap: true,
  },
  exports: true,
  sourcemap: true,
  publint: {
    level: "suggestion",
  },
});
