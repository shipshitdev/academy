import { defineConfig } from "vitest/config";

export default defineConfig({
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
