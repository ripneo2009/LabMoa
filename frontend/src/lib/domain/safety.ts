// 멘토 승인용 안전 체크리스트 (§7). React/Prisma/Next.js에 의존하지 않는 순수 함수만 둔다.
// Lab.safetyLevel(연구실 안전등급 배지)과는 다른 개념이다 — lib/constants/safety-level.ts 참고.
export const SAFETY_ITEMS = [
  "시약 위험성 확인",
  "장비 사용 자격 확인",
  "개인 보호구 준비",
  "폐기물 처리 계획",
  "보호자 동의 확인",
] as const;

export type SafetyItem = (typeof SAFETY_ITEMS)[number];

/**
 * 안전 체크리스트 5항목이 모두 체크되었는지 확인한다.
 * @param checked 체크된 항목 목록
 * @returns 5항목 전부 체크되었으면 true
 */
export function isSafetyPassed(checked: string[]): boolean {
  return SAFETY_ITEMS.every((item) => checked.includes(item));
}
