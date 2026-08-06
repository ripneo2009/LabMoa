"use client"

// 검토 코멘트 한 건 — severity별 색(blocker=Danger, warning=Warning, info=회색).
// 삽입 시 16px 아래에서 페이드인, 형제 항목은 layout으로 자연스럽게 밀린다.
import { motion } from "motion/react";

import { cn, formatShortDateTime } from "@/lib/utils";
import { DURATION, EASE } from "@/lib/constants/motion";
import type { ReviewNote } from "@/types/proposal";

export interface ReviewNoteItemProps {
  note: ReviewNote;
  authorLabel: string;
  onDelete?: () => void;
}

const SEVERITY_STYLE: Record<ReviewNote["severity"], string> = {
  blocker: "border-destructive/40 bg-destructive/5 text-destructive",
  warning: "border-warning/40 bg-warning/5 text-warning",
  info: "border-border bg-muted text-muted-foreground",
};

const SEVERITY_LABEL: Record<ReviewNote["severity"], string> = {
  blocker: "필수 수정",
  warning: "확인 필요",
  info: "참고",
};

function ReviewNoteItem({ note, authorLabel, onDelete }: ReviewNoteItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: DURATION.base, ease: EASE.out }}
      className={cn("flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-sm", SEVERITY_STYLE[note.severity])}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold">{SEVERITY_LABEL[note.severity]}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {authorLabel} · {formatShortDateTime(note.createdAt)}
          </span>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="text-muted-foreground underline-offset-2 hover:underline"
            >
              삭제
            </button>
          )}
        </div>
      </div>
      <p className="text-foreground">{note.comment}</p>
    </motion.div>
  );
}

export { ReviewNoteItem };
