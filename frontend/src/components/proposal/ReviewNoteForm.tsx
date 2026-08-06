"use client"

// 코멘트 추가 폼 — "+ 코멘트 추가" 버튼을 누르면 펼쳐진다.
// height를 직접 애니메이션하지 않고 motion layout으로 자연스럽게 밀리게 한다.
import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { Button, Textarea } from "@/components/ui"
import { cn } from "@/lib/utils"
import { DURATION, EASE } from "@/lib/constants/motion"
import { getErrorMessage } from "@/lib/utils"
import type { ReviewSeverity } from "@/types/proposal"

export interface ReviewNoteFormProps {
  onSubmit: (comment: string, severity: ReviewSeverity) => Promise<void>
}

const SEVERITY_OPTIONS: { value: ReviewSeverity; label: string }[] = [
  { value: "blocker", label: "필수 수정" },
  { value: "warning", label: "확인 필요" },
  { value: "info", label: "참고" },
]

function ReviewNoteForm({ onSubmit }: ReviewNoteFormProps) {
  const [open, setOpen] = React.useState(false)
  const [comment, setComment] = React.useState("")
  const [severity, setSeverity] = React.useState<ReviewSeverity>("info")
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit() {
    if (!comment.trim()) return
    setPending(true)
    setError(null)
    try {
      await onSubmit(comment.trim(), severity)
      setComment("")
      setSeverity("info")
      setOpen(false)
    } catch (caught) {
      setError(getErrorMessage(caught, "코멘트를 등록하지 못했습니다."))
    } finally {
      setPending(false)
    }
  }

  return (
    <motion.div layout className="flex flex-col gap-2">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="self-start text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          + 코멘트 추가
        </button>
      )}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.base, ease: EASE.out }}
            className="flex flex-col gap-2 rounded-lg border border-border p-3"
          >
            <div className="flex gap-1.5">
              {SEVERITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSeverity(option.value)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors duration-(--dur-instant)",
                    severity === option.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="이 항목에 대한 코멘트를 남겨주세요."
              rows={2}
            />
            {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button type="button" variant="outline" size="sm" disabled={pending} onClick={handleSubmit}>
                {pending ? "등록 중…" : "등록"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export { ReviewNoteForm }
