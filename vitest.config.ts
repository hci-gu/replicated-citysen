import { defineConfig } from "vitest/config";
import type { PluginOption } from "vite";
import react from "@vitejs/plugin-react";

const plugins: PluginOption[] = [react() as PluginOption];

export default defineConfig({
  plugins,
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true
  }
});
