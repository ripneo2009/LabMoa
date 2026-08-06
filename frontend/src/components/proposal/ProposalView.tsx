"use client"

// 계획서 읽기 전용 보기 — 6개 항목 + 항목별 인라인 검토 코멘트.
// mode="mentor"일 때만 코멘트 추가/삭제 UI가 붙고, 관련 server action을 직접 호출한다.
import { AnimatePresence } from "motion/react"
import { useRouter } from "next/navigation"

import { addReviewNote, deleteReviewNote } from "@/lib/actions/review.actions"
import type { MaterialItem, ProposalDetail, ReviewTargetField } from "@/types/proposal"
import { ProposalSection } from "./ProposalSection"
import { ReviewNoteItem } from "./ReviewNoteItem"
import { ReviewNoteForm } from "./ReviewNoteForm"

export interface ProposalViewProps {
  proposal: Pick<
    ProposalDetail,
    | "id"
    | "title"
    | "motivation"
    | "hypothesis"
    | "method"
    | "neededMaterials"
    | "neededEquipment"
    | "durationHours"
    | "safetyNotes"
    | "reviewNotes"
  >
  mode: "student" | "mentor"
}

function formatMaterial(item: MaterialItem): string {
  return `${item.name} · ₩${item.unitPrice.toLocaleString("ko-KR")} × ${item.qty}`
}

function ProposalView({ proposal, mode }: ProposalViewProps) {
  const router = useRouter()

  function renderNotes(field: ReviewTargetField) {
    const notes = proposal.reviewNotes.filter((note) => note.targetField === field)
    return (
      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {notes.map((note) => (
            <ReviewNoteItem
              key={note.id}
              note={note}
              authorLabel="멘토"
              onDelete={
                mode === "mentor"
                  ? async () => {
                      await deleteReviewNote(note.id, proposal.id)
                      router.refresh()
                    }
                  : undefined
              }
            />
          ))}
        </AnimatePresence>
        {mode === "mentor" && (
          <ReviewNoteForm
            onSubmit={async (comment, severity) => {
              await addReviewNote(proposal.id, field, comment, severity)
              router.refresh()
            }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <ProposalSection title="주제 · 동기">
        <p className="text-sm font-medium text-foreground">{proposal.title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{proposal.motivation}</p>
      </ProposalSection>

      <ProposalSection title="가설" fieldKey="hypothesis">
        <p className="text-sm leading-6 text-muted-foreground">{proposal.hypothesis}</p>
        {renderNotes("hypothesis")}
      </ProposalSection>

      <ProposalSection title="실험 방법" fieldKey="method">
        <p className="text-sm leading-6 text-muted-foreground">{proposal.method}</p>
        {renderNotes("method")}
      </ProposalSection>

      <ProposalSection title="필요 재료 · 장비" fieldKey="materials">
        <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
          {proposal.neededMaterials.map((item) => (
            <li key={item.name}>{formatMaterial(item)}</li>
          ))}
        </ul>
        {proposal.neededEquipment.length > 0 && (
          <p className="text-sm text-muted-foreground">
            필요 장비: {proposal.neededEquipment.join(", ")}
          </p>
        )}
        {renderNotes("materials")}
      </ProposalSection>

      <ProposalSection title="예상 소요시간">
        <p className="text-sm text-muted-foreground">{proposal.durationHours}시간</p>
      </ProposalSection>

      <ProposalSection title="안전 고려사항" fieldKey="safety">
        <p className="text-sm leading-6 text-muted-foreground">{proposal.safetyNotes}</p>
        {renderNotes("safety")}
      </ProposalSection>
    </div>
  )
}

export { ProposalView }
