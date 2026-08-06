import { describe, expect, it } from "vitest";
import { canTransition, nextStatus } from "../proposal-state";

describe("canTransition", () => {
  it("allows draft to submitted", () => {
    expect(canTransition("draft", "submitted")).toBe(true);
  });

  it("allows submitted to revision", () => {
    expect(canTransition("submitted", "revision")).toBe(true);
  });

  it("allows submitted to rejected", () => {
    expect(canTransition("submitted", "rejected")).toBe(true);
  });

  it("allows revision to submitted", () => {
    expect(canTransition("revision", "submitted")).toBe(true);
  });

  it("requires safetyPassed to allow submitted to approved", () => {
    expect(canTransition("submitted", "approved")).toBe(false);
    expect(canTransition("submitted", "approved", { safetyPassed: false })).toBe(false);
    expect(canTransition("submitted", "approved", { safetyPassed: true })).toBe(true);
  });

  it("rejects transitions out of approved", () => {
    expect(canTransition("approved", "submitted")).toBe(false);
    expect(canTransition("approved", "revision")).toBe(false);
  });

  it("rejects transitions out of rejected", () => {
    expect(canTransition("rejected", "submitted")).toBe(false);
  });

  it("rejects skipping states (draft to approved)", () => {
    expect(canTransition("draft", "approved", { safetyPassed: true })).toBe(false);
  });
});

describe("nextStatus", () => {
  it("computes submit from draft", () => {
    expect(nextStatus("submit", "draft")).toBe("submitted");
  });

  it("computes submit from revision", () => {
    expect(nextStatus("submit", "revision")).toBe("submitted");
  });

  it("computes request_revision from submitted", () => {
    expect(nextStatus("request_revision", "submitted")).toBe("revision");
  });

  it("computes reject from submitted", () => {
    expect(nextStatus("reject", "submitted")).toBe("rejected");
  });

  it("returns null for approve without safetyPassed", () => {
    expect(nextStatus("approve", "submitted")).toBeNull();
  });

  it("computes approve from submitted when safetyPassed", () => {
    expect(nextStatus("approve", "submitted", { safetyPassed: true })).toBe("approved");
  });

  it("returns null for invalid current state", () => {
    expect(nextStatus("submit", "approved")).toBeNull();
    expect(nextStatus("submit", "rejected")).toBeNull();
  });
});
