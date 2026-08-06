"use client"

// 상단 sticky 진행바 — 작성 → 멘토 검토 → 승인 → 예약. rejected는 별도 배너로 표시한다.
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { DURATION, EASE } from "@/lib/constants/motion";
import type { ProposalStatus } from "@/types/proposal";

const STAGES = ["작성", "멘토 검토", "승인", "예약"] as const;

export interface ProposalStepperProps {
  status: ProposalStatus;
  /** 예약(Booking)까지 진행되었는지 — 없으면 승인 단계까지만 표시 */
  booked?: boolean;
}

function statusToStageIndex(status: ProposalStatus, booked: boolean): number {
  if (booked) return 3;
  switch (status) {
    case "submitted":
      return 1;
    case "approved":
      return 2;
    case "draft":
    case "revision":
    case "rejected":
    default:
      return 0;
  }
}

function ProposalStepper({ status, booked = false }: ProposalStepperProps) {
  if (status === "rejected") {
    return (
      <div className="sticky top-16 z-30 border-b border-border bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
        이 계획서는 반려되었습니다.
      </div>
    );
  }

  const activeIndex = statusToStageIndex(status, booked);

  return (
    <div className="sticky top-16 z-30 border-b border-border bg-surface px-4 py-3">
      <ol className="mx-auto flex max-w-2xl items-center">
        {STAGES.map((stage, i) => (
          <li key={stage} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                  i <= activeIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "text-xs",
                  i <= activeIndex ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {stage}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full origin-left bg-primary"
                  initial={false}
                  animate={{ scaleX: i < activeIndex ? 1 : 0 }}
                  transition={{ duration: DURATION.base, ease: EASE.out }}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export { ProposalStepper };
