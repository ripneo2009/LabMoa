// TODO: 실제 조사 데이터로 교체 — OpenAlex 연동 전까지 쓰는 데모용 placeholder 논문 목록.
// openalexInstitutionId가 있는 랩은 /api/papers/sync 호출 시 실제 데이터로 upsert 갱신된다.
// 200줄 제한(§5.1) 때문에 랩 4곳씩 papers.data.ts / papers-2.data.ts로 나눴다.
import type { Field } from "@/lib/constants/fields";
import { papersData2 } from "./papers-2.data";

export interface SeedPaper {
  id: string;
  labId: string;
  title: string;
  journal: string;
  publishedAt: string; // ISO date
  doi: string | null;
  url: string | null;
  abstractSummary: string;
  tags: Field[];
}

const papersData1: SeedPaper[] = [
  // lab-kaist-chem
  {
    id: "paper-kaist-chem-1",
    labId: "lab-kaist-chem",
    title: "저온 조건에서의 균일계 촉매 반응 경로 최적화 연구",
    journal: "대한화학회지",
    publishedAt: "2026-03-12",
    doi: null,
    url: null,
    abstractSummary: "상온·저압 조건에서 반응 수율을 높이는 촉매 설계 전략을 제안했다.",
    tags: ["화학"],
  },
  {
    id: "paper-kaist-chem-2",
    labId: "lab-kaist-chem",
    title: "친환경 용매 기반 유기 합성 반응의 재현성 평가",
    journal: "대한화학회지",
    publishedAt: "2025-06-20",
    doi: null,
    url: null,
    abstractSummary: "용매 극성이 합성 수율과 부반응 생성에 미치는 영향을 정량 분석했다.",
    tags: ["화학", "재료"],
  },
  {
    id: "paper-kaist-chem-3",
    labId: "lab-kaist-chem",
    title: "촉매 표면 활성점 분석을 통한 반응 메커니즘 규명",
    journal: "한국공업화학회지",
    publishedAt: "2024-01-15",
    doi: null,
    url: null,
    abstractSummary: "분광 분석 기법으로 촉매 표면의 활성점을 특정하고 반응 경로를 제시했다.",
    tags: ["화학"],
  },
  // lab-kaist-bio
  {
    id: "paper-kaist-bio-1",
    labId: "lab-kaist-bio",
    title: "형광 리포터를 이용한 세포 내 신호전달 경로 실시간 관찰",
    journal: "한국생물공학회지",
    publishedAt: "2026-02-02",
    doi: null,
    url: null,
    abstractSummary: "생세포 이미징으로 자극 후 신호전달 단백질의 이동 경로를 추적했다.",
    tags: ["생명공학"],
  },
  {
    id: "paper-kaist-bio-2",
    labId: "lab-kaist-bio",
    title: "배양 조건 변화가 세포 증식 속도에 미치는 영향 분석",
    journal: "한국생물공학회지",
    publishedAt: "2025-09-11",
    doi: null,
    url: null,
    abstractSummary: "배지 조성과 온도 조건별 세포 증식 곡선을 비교했다.",
    tags: ["생명공학"],
  },
  {
    id: "paper-kaist-bio-3",
    labId: "lab-kaist-bio",
    title: "형질전환 세포주 확립을 위한 벡터 최적화",
    journal: "한국분자세포생물학회지",
    publishedAt: "2023-11-30",
    doi: null,
    url: null,
    abstractSummary: "삽입 효율을 높이는 벡터 설계 조건을 비교 평가했다.",
    tags: ["생명공학"],
  },
  // lab-kriss-physics
  {
    id: "paper-kriss-physics-1",
    labId: "lab-kriss-physics",
    title: "레이저 간섭계를 이용한 나노미터급 변위 측정 정밀도 향상",
    journal: "한국물리학회지",
    publishedAt: "2026-04-08",
    doi: null,
    url: null,
    abstractSummary: "간섭계 광학계 정렬 오차를 줄여 측정 반복성을 개선했다.",
    tags: ["물리"],
  },
  {
    id: "paper-kriss-physics-2",
    labId: "lab-kriss-physics",
    title: "진공 챔버 내 온도 안정화가 계측 오차에 미치는 영향",
    journal: "한국물리학회지",
    publishedAt: "2025-05-19",
    doi: null,
    url: null,
    abstractSummary: "온도 변화에 따른 계측 장비의 드리프트를 정량화했다.",
    tags: ["물리"],
  },
  {
    id: "paper-kriss-physics-3",
    labId: "lab-kriss-physics",
    title: "광검출기 신호 대 잡음비 개선을 위한 회로 설계",
    journal: "한국계측학회지",
    publishedAt: "2024-08-27",
    doi: null,
    url: null,
    abstractSummary: "저잡음 증폭 회로 구조를 제안하고 실측으로 성능을 검증했다.",
    tags: ["물리"],
  },
  // lab-krict-material
  {
    id: "paper-krict-material-1",
    labId: "lab-krict-material",
    title: "고분자 복합 소재의 열적 안정성 개선 연구",
    journal: "한국재료학회지",
    publishedAt: "2026-01-22",
    doi: null,
    url: null,
    abstractSummary: "충전제 함량에 따른 열분해 온도 변화를 TGA로 분석했다.",
    tags: ["재료"],
  },
  {
    id: "paper-krict-material-2",
    labId: "lab-krict-material",
    title: "XRD 분석을 통한 신소재 결정 구조 규명",
    journal: "한국재료학회지",
    publishedAt: "2025-07-03",
    doi: null,
    url: null,
    abstractSummary: "합성 조건별 결정상 변화를 XRD 패턴으로 비교했다.",
    tags: ["재료", "화학"],
  },
  {
    id: "paper-krict-material-3",
    labId: "lab-krict-material",
    title: "기능성 코팅 소재의 내구성 평가 방법론",
    journal: "한국공업화학회지",
    publishedAt: "2024-03-14",
    doi: null,
    url: null,
    abstractSummary: "가속 열화 시험으로 코팅 소재의 수명을 예측하는 방법을 제시했다.",
    tags: ["재료"],
  },
];

export const papersData: SeedPaper[] = [...papersData1, ...papersData2];
