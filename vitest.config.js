import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        include: ["**/*.test.{js,ts}"],
        exclude: ["node_modules/**", "dist/**", "build/**", "lib/**"]
    }
});
