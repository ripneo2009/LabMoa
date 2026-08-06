import { describe, expect, it } from "vitest";
import { calcMatchScore } from "../match-score";

describe("calcMatchScore", () => {
  it("returns 100 with full reasons on perfect match", () => {
    const result = calcMatchScore(["화학"], ["화학", "재료"], ["HPLC"], ["HPLC", "GC-MS"]);
    expect(result.score).toBe(100);
    expect(result.reasons).toContain("분야 태그 1개 일치");
    expect(result.reasons).toContain("장비 1개 중 1개 보유");
  });

  it("matches the spec example reason text", () => {
    const result = calcMatchScore(
      ["화학", "재료"],
      ["화학", "재료", "물리"],
      ["HPLC", "전자저울", "흄후드"],
      ["HPLC", "전자저울", "흄후드"],
    );
    expect(result.reasons).toContain("분야 태그 2개 일치");
    expect(result.reasons).toContain("장비 3개 중 3개 보유");
  });

  it("weights fields 0.6 and equipment 0.4", () => {
    // 분야 일치율 1.0, 장비 보유율 0 → score = 60
    const result = calcMatchScore(["화학"], ["화학"], ["HPLC"], []);
    expect(result.score).toBe(60);
  });

  it("reports zero equipment matches without dropping the reason", () => {
    // 분야는 학생이 지정하지 않아 완전 일치(0.6)로 간주되고, 장비만 0% 보유 → score = 60
    const result = calcMatchScore([], [], ["HPLC", "GC-MS"], []);
    expect(result.reasons).toContain("장비 2개 중 0개 보유");
    expect(result.score).toBe(60);
  });

  it("treats empty student criteria as full match (no preference)", () => {
    const result = calcMatchScore([], ["화학"], [], ["HPLC"]);
    expect(result.score).toBe(100);
    expect(result.reasons).toEqual([]);
  });

  it("returns 0 when nothing matches at all", () => {
    const result = calcMatchScore(["AI"], ["화학"], ["GPU 서버"], ["HPLC"]);
    expect(result.score).toBe(0);
    expect(result.reasons).toEqual(["장비 1개 중 0개 보유"]);
  });
});
