// TODO: 실제 조사 데이터로 교체 — 좌표/설명/장비 태그는 데모용 추정치이며 팀원이 실사할 것
import type { Field } from "@/lib/constants/fields";
import type { Region } from "@/lib/constants/regions";
import type { SafetyLevel } from "@/lib/constants/safety-level";

export interface SeedLab {
  id: string;
  name: string;
  org: string;
  address: string;
  region: Region;
  lat: number;
  lng: number;
  fieldTags: Field[];
  equipment: string[];
  safetyLevel: SafetyLevel;
  hourlyRate: number;
  materialPolicy: string;
  description: string;
  openalexInstitutionId: string | null;
}

export const labsData: SeedLab[] = [
  {
    id: "lab-kaist-chem",
    name: "촉매화학연구실",
    org: "KAIST 화학과",
    address: "대전광역시 유성구 대학로 291",
    region: "유성구",
    lat: 36.3722,
    lng: 127.3606,
    fieldTags: ["화학", "재료"],
    equipment: ["HPLC", "GC-MS", "전자저울", "흄후드"],
    safetyLevel: "주의",
    hourlyRate: 15000,
    materialPolicy: "시약비는 실비 정산, 촉매 재료는 연구실 지원 가능",
    description:
      "친환경 촉매 반응 경로를 설계하고 소량 합성 실험으로 검증하는 연구실입니다.",
    openalexInstitutionId: "https://openalex.org/I157485424",
  },
  {
    id: "lab-kaist-bio",
    name: "분자세포생물학연구실",
    org: "KAIST 생명과학과",
    address: "대전광역시 유성구 대학로 291",
    region: "유성구",
    lat: 36.3701,
    lng: 127.3635,
    fieldTags: ["생명공학"],
    equipment: ["PCR 기기", "인큐베이터", "형광현미경", "클린벤치(무균실습대)"],
    safetyLevel: "주의",
    hourlyRate: 12000,
    materialPolicy: "시약·배지는 연구실 제공, 특수 시약만 실비 정산",
    description:
      "세포 신호전달 경로를 형광 이미징으로 관찰하는 실험을 지도합니다.",
    openalexInstitutionId: "https://openalex.org/I157485424",
  },
  {
    id: "lab-kriss-physics",
    name: "정밀계측연구실",
    org: "한국표준과학연구원(KRISS)",
    address: "대전광역시 유성구 가정로 267",
    region: "유성구",
    lat: 36.3835,
    lng: 127.3626,
    fieldTags: ["물리"],
    equipment: ["레이저간섭계", "오실로스코프", "진공챔버"],
    safetyLevel: "일반",
    hourlyRate: 10000,
    materialPolicy: "장비 소모품은 기관 지원, 개인 실험 재료는 실비 정산",
    description:
      "빛과 물질의 정밀 계측 원리를 직접 측정 실험으로 확인하는 연구실입니다.",
    openalexInstitutionId: "https://openalex.org/I2799611809",
  },
  {
    id: "lab-krict-material",
    name: "신소재화학연구실",
    org: "한국화학연구원(KRICT)",
    address: "대전광역시 유성구 가정로 141",
    region: "유성구",
    lat: 36.3801,
    lng: 127.3653,
    fieldTags: ["재료", "화학"],
    equipment: ["X선 회절분석기(XRD)", "열중량분석기(TGA)", "전자저울"],
    safetyLevel: "위험물 취급",
    hourlyRate: 18000,
    materialPolicy: "고가 시약은 기관 지원, 소모품은 실비 정산",
    description: "기능성 신소재를 합성하고 열적·구조적 특성을 분석합니다.",
    openalexInstitutionId: "https://openalex.org/I4210151417",
  },
  {
    id: "lab-etri-ai",
    name: "AI로보틱스연구실",
    org: "한국전자통신연구원(ETRI)",
    address: "대전광역시 유성구 가정로 218",
    region: "유성구",
    lat: 36.3843,
    lng: 127.3676,
    fieldTags: ["AI"],
    equipment: ["GPU 서버", "로봇팔"],
    safetyLevel: "일반",
    hourlyRate: 8000,
    materialPolicy: "컴퓨팅 자원은 기관 지원, 별도 재료비 없음",
    description:
      "센서 데이터를 학습해 로봇 제어 모델을 만들어보는 실습형 연구실입니다.",
    openalexInstitutionId: "https://openalex.org/I142401562",
  },
  {
    id: "lab-kribb-enviro",
    name: "환경미생물연구실",
    org: "한국생명공학연구원(KRIBB)",
    address: "대전광역시 유성구 과학로 125",
    region: "유성구",
    lat: 36.3838,
    lng: 127.3765,
    fieldTags: ["환경", "생명공학"],
    equipment: ["오토클레이브", "인큐베이터", "수질분석기"],
    safetyLevel: "주의",
    hourlyRate: 11000,
    materialPolicy: "배양 재료는 연구실 제공, 현장 시료 채취 비용은 실비 정산",
    description:
      "하천·토양 미생물 군집을 배양하고 환경 정화 가능성을 탐색합니다.",
    openalexInstitutionId: "https://openalex.org/I73616290",
  },
  {
    id: "lab-hannam-physics",
    name: "응용플라즈마연구실",
    org: "한남대학교 물리학과",
    address: "대전광역시 대덕구 한남로 70",
    region: "대덕구",
    lat: 36.3504,
    lng: 127.4256,
    fieldTags: ["물리", "환경"],
    equipment: ["진공펌프", "플라즈마발생장치", "오실로스코프"],
    safetyLevel: "주의",
    hourlyRate: 9000,
    materialPolicy: "실험 가스·소모품은 실비 정산",
    description:
      "저온 플라즈마를 이용한 표면 처리·살균 효과를 측정하는 학부 연계 연구실입니다.",
    openalexInstitutionId: null,
  },
  {
    id: "lab-jung-env",
    name: "도시환경분석연구실",
    org: "대전 중구 환경기술센터",
    address: "대전광역시 중구 대흥로 100",
    region: "중구",
    lat: 36.326,
    lng: 127.4238,
    fieldTags: ["환경"],
    equipment: ["대기측정장비", "수질분석기", "GC-MS"],
    safetyLevel: "일반",
    hourlyRate: 9000,
    materialPolicy: "시료 채취 키트는 제공, 분석 시약은 실비 정산",
    description:
      "도심 대기질·수질 데이터를 직접 측정하고 분석하는 지역 밀착형 연구실입니다.",
    openalexInstitutionId: null,
  },
];
