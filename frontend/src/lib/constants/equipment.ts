// 보유 장비 태그 — 검색 위저드 3단계(필요 장비), Lab.equipment 값의 단일 소스
export const EQUIPMENT = [
  "HPLC",
  "GC-MS",
  "분광광도계",
  "전자저울",
  "흄후드",
  "PCR 기기",
  "인큐베이터",
  "형광현미경",
  "클린벤치(무균실습대)",
  "오토클레이브",
  "원심분리기",
  "전자현미경(SEM)",
  "X선 회절분석기(XRD)",
  "열중량분석기(TGA)",
  "원자현미경(AFM)",
  "3D 프린터",
  "레이저 커터",
  "수질분석기",
  "대기측정장비",
  "GPU 서버",
  "로봇팔",
  "오실로스코프",
  "진공챔버",
] as const;

export type Equipment = (typeof EQUIPMENT)[number];
