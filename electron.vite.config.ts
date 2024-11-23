import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: "vite/main",
      emptyOutDir: true,
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: "vite/preload",
      emptyOutDir: true,
    },
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
      },
    },
    plugins: [react()],
    build: {
      outDir: "vite/renderer",
      emptyOutDir: true,
    },
  },
});
