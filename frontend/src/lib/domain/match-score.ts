// 검색 매칭 점수 계산 (§7). React/Prisma/Next.js에 의존하지 않는 순수 함수만 둔다.
export interface MatchResult {
  score: number;
  reasons: string[];
}

/** 총 개수가 0이면(=학생이 조건을 지정하지 않았으면) 완전 일치로 간주한다. */
function matchRatio(matchedCount: number, totalCount: number): number {
  if (totalCount === 0) return 1;
  return matchedCount / totalCount;
}

/**
 * 학생이 원하는 분야/장비와 연구실이 보유한 분야/장비를 비교해 매칭 점수와 근거를 계산한다.
 * score = 분야 일치율 × 0.6 + 장비 보유율 × 0.4 (0~100, 정수 반올림)
 * @param studentFields 학생이 선택한 분야 태그
 * @param labFields 연구실의 분야 태그
 * @param studentEquip 학생이 필요로 하는 장비
 * @param labEquip 연구실이 보유한 장비
 * @returns 매칭 점수와 근거 문구 목록
 */
export function calcMatchScore(
  studentFields: string[],
  labFields: string[],
  studentEquip: string[],
  labEquip: string[],
): MatchResult {
  const fieldMatches = studentFields.filter((field) => labFields.includes(field));
  const equipMatches = studentEquip.filter((equip) => labEquip.includes(equip));

  const fieldRatio = matchRatio(fieldMatches.length, studentFields.length);
  const equipRatio = matchRatio(equipMatches.length, studentEquip.length);

  const score = Math.round((fieldRatio * 0.6 + equipRatio * 0.4) * 100);

  const reasons: string[] = [];
  if (fieldMatches.length > 0) {
    reasons.push(`분야 태그 ${fieldMatches.length}개 일치`);
  }
  if (studentEquip.length > 0) {
    reasons.push(`장비 ${studentEquip.length}개 중 ${equipMatches.length}개 보유`);
  }

  return { score, reasons };
}
