// 연구실 안전등급 배지(Lab.safetyLevel) 값의 단일 소스.
// lib/domain/safety.ts의 5항목 체크리스트(계획서 승인용)와는 별개 개념이다.
export const SAFETY_LEVELS = ["일반", "주의", "위험물 취급"] as const;

export type SafetyLevel = (typeof SAFETY_LEVELS)[number];
