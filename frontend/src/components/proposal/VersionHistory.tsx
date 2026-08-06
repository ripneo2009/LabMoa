"use client"

// 버전 히스토리 토글 — 스키마에 과거 버전 스냅샷이 없어(§6), 버전 번호 + 검토 코멘트
// 타임라인으로 이력을 보여준다. 펼침/접힘은 motion layout으로 처리한다.
import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { DURATION, EASE } from "@/lib/constants/motion"
import { formatDateTime } from "@/lib/utils"
import type { ReviewNote } from "@/types/proposal"

export interface VersionHistoryProps {
  version: number
  reviewNotes: ReviewNote[]
}

function VersionHistory({ version, reviewNotes }: VersionHistoryProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <motion.div layout className="flex flex-col gap-2 border-t border-border pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="self-start text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        버전 히스토리 (v{version}) {open ? "숨기기 ▲" : "보기 ▼"}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.base, ease: EASE.out }}
            className="flex flex-col gap-2 text-xs text-muted-foreground"
          >
            {reviewNotes.length === 0 ? (
              <li>아직 검토 이력이 없어요.</li>
            ) : (
              reviewNotes.map((note) => (
                <li key={note.id}>
                  {formatDateTime(note.createdAt)} · {note.comment}
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export { VersionHistory }
