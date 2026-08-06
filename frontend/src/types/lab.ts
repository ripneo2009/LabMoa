// 연구실/멘토/논문 도메인 타입 — DB의 JSON 문자열 배열은 파싱된 string[]로 표현한다
import type { Field } from "@/lib/constants/fields";
import type { Region } from "@/lib/constants/regions";
import type { SafetyLevel } from "@/lib/constants/safety-level";

export interface Lab {
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

export type MentorDegree = "석사" | "박사" | "박사후";

export interface Mentor {
  id: string;
  userId: string;
  name: string;
  labId: string;
  degree: MentorDegree;
  field: string;
  bio: string;
  researchKeywords: string[];
  responseRate: number;
}

export interface Paper {
  id: string;
  labId: string;
  title: string;
  journal: string;
  publishedAt: string;
  doi: string | null;
  url: string | null;
  abstractSummary: string | null;
  tags: string[];
}

/** 검색 결과 카드에서 쓰는, 매칭 정보가 덧붙은 랩 요약 타입 */
export interface LabSearchResult extends Lab {
  matchScore: number;
  matchReasons: string[];
  recentPaperCount: number;
  mentorDegree: MentorDegree | null;
}

/** 랩 상세 페이지에서 쓰는, 관계 데이터가 포함된 타입 */
export interface LabDetail extends Lab {
  mentors: Mentor[];
  papers: Paper[];
}

/** 검색 위저드가 수집하는 조건. region은 하드 필터, fields/equipment는 매칭 점수에 반영된다. */
export interface SearchFilters {
  region: Region | null;
  fields: Field[];
  equipment: string[];
  experimentText: string;
}
