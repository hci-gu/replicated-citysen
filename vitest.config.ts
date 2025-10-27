import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Vitest bundles its own Vite types, which can diverge from the root Vite types
// that `@vitejs/plugin-react` references. When Next.js runs `tsc --noEmit` the
// differing structural types cause the build to fail. Casting the plugin to
// `any` avoids the incompatible type comparison while keeping the practical
// behaviour unchanged.
const reactPlugin = react as unknown as () => any;

export default defineConfig({
  plugins: [reactPlugin()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true
  }
});
