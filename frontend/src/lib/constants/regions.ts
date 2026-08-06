// 대전 5개 구 — 검색 위저드 1단계, Lab.region 값의 단일 소스
export const REGIONS = ["유성구", "대덕구", "중구", "동구", "서구"] as const;

export type Region = (typeof REGIONS)[number];
