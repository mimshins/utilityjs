import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  tsconfig: "./tsconfig.json",
  clean: true,
  format: "esm",
  outDir: "dist",
  minify: true,
  sourcemap: true,
  platform: "browser",
  dts: true,
  outExtensions: () => ({
    js: ".js",
    dts: ".d.ts",
  }),
});
