// 연구 분야 태그 — 검색 위저드 2단계, Lab.fieldTags / Mentor.field 값의 단일 소스
export const FIELDS = ["화학", "생명공학", "재료", "물리", "환경", "AI"] as const;

export type Field = (typeof FIELDS)[number];
