// 연구계획서/검토 코멘트/채팅 메시지 도메인 타입
export type ProposalStatus =
  | "draft"
  | "submitted"
  | "revision"
  | "approved"
  | "rejected";

export type ReviewTargetField = "hypothesis" | "method" | "materials" | "safety";
export type ReviewSeverity = "blocker" | "warning" | "info";

export interface MaterialItem {
  name: string;
  unitPrice: number;
  qty: number;
}

export interface Proposal {
  id: string;
  studentId: string;
  labId: string;
  mentorId: string | null;
  title: string;
  motivation: string;
  hypothesis: string;
  method: string;
  neededMaterials: MaterialItem[];
  neededEquipment: string[];
  durationHours: number;
  safetyNotes: string;
  status: ProposalStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewNote {
  id: string;
  proposalId: string;
  authorId: string;
  targetField: ReviewTargetField;
  comment: string;
  severity: ReviewSeverity;
  createdAt: string;
}

export interface Message {
  id: string;
  proposalId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

/** 목록(멘토 대시보드 등)에서 쓰는, 학생/랩 이름이 덧붙은 요약 타입 */
export interface ProposalSummary extends Proposal {
  studentName: string;
  labName: string;
}

/** 계획서 상세 화면에서 쓰는, 검토 코멘트까지 포함된 타입 */
export interface ProposalDetail extends ProposalSummary {
  mentorName: string | null;
  reviewNotes: ReviewNote[];
}
