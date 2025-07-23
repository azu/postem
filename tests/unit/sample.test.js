import { describe, it, expect } from "vitest";

describe("Sample Tests", () => {
    it("should pass basic test", () => {
        expect(1 + 1).toBe(2);
    });

    it("should handle strings", () => {
        const message = "Hello, Vitest!";
        expect(message).toContain("Vitest");
    });
});
