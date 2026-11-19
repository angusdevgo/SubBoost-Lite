import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_REPOSITORY_SLUG, resolveRepositorySlug } from "./repository";

describe("resolveRepositorySlug", () => {
  const originalEnv = process.env.REPOSITORY_SLUG;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env.REPOSITORY_SLUG = originalEnv;
    vi.unstubAllGlobals();
  });

  it("returns the default slug when no override is set", () => {
    delete process.env.REPOSITORY_SLUG;
    expect(resolveRepositorySlug()).toBe(DEFAULT_REPOSITORY_SLUG);
    expect(DEFAULT_REPOSITORY_SLUG).toBe("G1oow/SubBoost-Worker-Lite");
  });

  it("prefers a valid REPOSITORY_SLUG override", () => {
    process.env.REPOSITORY_SLUG = "angusdevgo/SubBoost-Lite";
    expect(resolveRepositorySlug()).toBe("angusdevgo/SubBoost-Lite");
  });

  it("trims whitespace around the override", () => {
    process.env.REPOSITORY_SLUG = "  angusdevgo/SubBoost-Lite  ";
    expect(resolveRepositorySlug()).toBe("angusdevgo/SubBoost-Lite");
  });

  it("falls back to default when override is malformed", () => {
    const invalidValues = [
      "just-a-name",
      "owner/",
      "/repo",
      "owner/repo/extra",
      "owner/repo extra",
      "owner//repo",
      "",
    ];
    for (const value of invalidValues) {
      process.env.REPOSITORY_SLUG = value;
      expect(resolveRepositorySlug()).toBe(DEFAULT_REPOSITORY_SLUG);
    }
  });

  it("is evaluated lazily so tests can swap env between cases", async () => {
    // 确保模块在设置 env 之后才被 import
    process.env.REPOSITORY_SLUG = "fork-owner/fork-repo";
    const mod = await import("./repository?query=" + Date.now());
    expect(mod.REPOSITORY_SLUG).toBe("fork-owner/fork-repo");
    expect(mod.REPOSITORY_URL).toBe("https://github.com/fork-owner/fork-repo");
    expect(mod.UPSTREAM_PACKAGE_JSON_URL).toBe(
      "https://raw.githubusercontent.com/fork-owner/fork-repo/main/package.json"
    );
  });
});
