import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./packages/components"),
      "@services": path.resolve(__dirname, "./packages/services"),
      "@hooks": path.resolve(__dirname, "./packages/hooks"),
      "@interfaces": path.resolve(__dirname, "./packages/interfaces"),
      "@props": path.resolve(__dirname, "./packages/props"),
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.spec.ts", "**/*.test.ts"],
    exclude: ["node_modules", "dist", ".next", "build"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["packages/**/*.ts", "packages/**/*.tsx"],
      exclude: ["**/*.spec.ts", "**/*.test.ts", "**/*.d.ts", "**/index.ts"],
      thresholds: {
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0,
      },
    },
    mockReset: true,
    restoreMocks: true,
  },
});
