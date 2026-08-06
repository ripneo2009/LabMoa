import { describe, expect, it } from "vitest";
import { isSafetyPassed, SAFETY_ITEMS } from "../safety";

describe("SAFETY_ITEMS", () => {
  it("has exactly 5 items", () => {
    expect(SAFETY_ITEMS.length).toBe(5);
  });
});

describe("isSafetyPassed", () => {
  it("passes when all 5 items are checked", () => {
    expect(isSafetyPassed([...SAFETY_ITEMS])).toBe(true);
  });

  it("fails when only 4 items are checked", () => {
    expect(isSafetyPassed(SAFETY_ITEMS.slice(0, 4))).toBe(false);
  });

  it("fails when nothing is checked", () => {
    expect(isSafetyPassed([])).toBe(false);
  });

  it("ignores unrelated extra entries as long as all 5 required items are present", () => {
    expect(isSafetyPassed([...SAFETY_ITEMS, "기타 메모"])).toBe(true);
  });
});
