// 연구계획서 상태 전이 규칙 (§7). React/Prisma/Next.js에 의존하지 않는 순수 함수만 둔다.
import type { ProposalStatus } from "@/types/proposal";

export type ProposalAction =
  | "submit"
  | "request_revision"
  | "approve"
  | "reject";

export interface TransitionContext {
  /** 멘토의 안전 체크리스트 5항목이 모두 통과되었는지 여부. approved 전이에만 요구된다. */
  safetyPassed?: boolean;
}

const ALLOWED_TRANSITIONS: Record<ProposalStatus, ProposalStatus[]> = {
  draft: ["submitted"],
  submitted: ["revision", "approved", "rejected"],
  revision: ["submitted"],
  approved: [],
  rejected: [],
};

const ACTION_TARGET: Record<ProposalAction, ProposalStatus> = {
  submit: "submitted",
  request_revision: "revision",
  approve: "approved",
  reject: "rejected",
};

/**
 * from 상태에서 to 상태로 전이할 수 있는지 검사한다.
 * @param from 현재 상태
 * @param to 전이하려는 상태
 * @param ctx 전이 컨텍스트. approved로 전이하려면 ctx.safetyPassed가 true여야 한다.
 * @returns 전이 가능 여부
 */
export function canTransition(
  from: ProposalStatus,
  to: ProposalStatus,
  ctx: TransitionContext = {},
): boolean {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) return false;
  if (to === "approved" && ctx.safetyPassed !== true) return false;
  return true;
}

/**
 * action을 current 상태에 적용했을 때의 다음 상태를 계산한다.
 * @param action 수행하려는 액션
 * @param current 현재 상태
 * @param ctx 전이 컨텍스트. approve 액션은 ctx.safetyPassed가 true여야 성공한다.
 * @returns 다음 상태. 전이가 불가능하면 null.
 */
export function nextStatus(
  action: ProposalAction,
  current: ProposalStatus,
  ctx: TransitionContext = {},
): ProposalStatus | null {
  const target = ACTION_TARGET[action];
  return canTransition(current, target, ctx) ? target : null;
}
