// 계획서 상태 배지 — Badge가 이미 텍스트 crossfade + 너비 layout 전환을 지원한다
import { Badge } from "@/components/ui";
import type { ProposalStatus } from "@/types/proposal";

export interface StatusBadgeProps {
  status: ProposalStatus;
}

const STATUS_LABEL: Record<ProposalStatus, string> = {
  draft: "임시저장",
  submitted: "검토 중",
  revision: "수정 요청",
  approved: "승인됨",
  rejected: "반려됨",
};

const STATUS_VARIANT: Record<ProposalStatus, "outline" | "secondary" | "warning" | "success" | "destructive"> = {
  draft: "outline",
  submitted: "secondary",
  revision: "warning",
  approved: "success",
  rejected: "destructive",
};

function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}

export { StatusBadge, STATUS_LABEL };
