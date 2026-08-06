"use client"

// 계획서 작성/수정 폼. mode="new"면 시작 게이트만, mode="edit"이면 6개 항목 편집 폼을 보여준다.
import * as React from "react"
import { useRouter } from "next/navigation"

import { Button, Chip, Input, Textarea } from "@/components/ui"
import { EQUIPMENT } from "@/lib/constants/equipment"
import { saveProposalDraft, submitProposal, type ProposalInput } from "@/lib/actions/proposal.actions"
import type { ProposalDetail } from "@/types/proposal"
import { MaterialsEditor } from "./MaterialsEditor"
import { getErrorMessage } from "@/lib/utils"
import { NewProposalGate } from "./NewProposalGate"
import { ProposalSection } from "./ProposalSection"

export type ProposalFormProps =
  | { mode: "new"; labId: string; labName: string }
  | { mode: "edit"; proposal: ProposalDetail }

function toInput(proposal: ProposalDetail): ProposalInput {
  return {
    title: proposal.title,
    motivation: proposal.motivation,
    hypothesis: proposal.hypothesis,
    method: proposal.method,
    neededMaterials: proposal.neededMaterials,
    neededEquipment: proposal.neededEquipment,
    durationHours: proposal.durationHours,
    safetyNotes: proposal.safetyNotes,
  }
}

function EditableProposalForm({ proposal }: { proposal: ProposalDetail }) {
  const router = useRouter()
  const [input, setInput] = React.useState<ProposalInput>(() => toInput(proposal))
  const [pending, setPending] = React.useState<"draft" | "submit" | null>(null)
  const [feedback, setFeedback] = React.useState<{ kind: "success" | "error"; text: string } | null>(null)

  function set<K extends keyof ProposalInput>(key: K, value: ProposalInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  function toggleEquipment(item: string, selected: boolean) {
    set(
      "neededEquipment",
      selected ? [...input.neededEquipment, item] : input.neededEquipment.filter((e) => e !== item),
    )
  }

  async function handleSave() {
    setPending("draft")
    setFeedback(null)
    try {
      await saveProposalDraft(proposal.id, input)
      setFeedback({ kind: "success", text: "임시저장했습니다." })
      router.refresh()
    } catch (caught) {
      setFeedback({ kind: "error", text: getErrorMessage(caught, "저장하지 못했습니다.") })
    } finally {
      setPending(null)
    }
  }

  async function handleSubmit() {
    setPending("submit")
    setFeedback(null)
    try {
      await submitProposal(proposal.id, input)
      setFeedback({ kind: "success", text: "계획서를 제출했습니다." })
      router.refresh()
    } catch (caught) {
      setFeedback({ kind: "error", text: getErrorMessage(caught, "제출하지 못했습니다.") })
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ProposalSection title="주제 · 동기">
        <Input value={input.title} onChange={(e) => set("title", e.target.value)} placeholder="계획서 제목" />
        <Textarea
          value={input.motivation}
          onChange={(e) => set("motivation", e.target.value)}
          placeholder="이 실험을 하고 싶은 이유"
          rows={3}
        />
      </ProposalSection>

      <ProposalSection title="가설">
        <Textarea
          value={input.hypothesis}
          onChange={(e) => set("hypothesis", e.target.value)}
          placeholder="검증하고 싶은 가설"
          rows={3}
        />
      </ProposalSection>

      <ProposalSection title="실험 방법">
        <Textarea
          value={input.method}
          onChange={(e) => set("method", e.target.value)}
          placeholder="구체적인 실험 절차"
          rows={4}
        />
      </ProposalSection>

      <ProposalSection title="필요 재료 · 장비">
        <MaterialsEditor items={input.neededMaterials} onChange={(v) => set("neededMaterials", v)} />
        <div className="flex flex-wrap gap-2 pt-2">
          {EQUIPMENT.map((item) => (
            <Chip
              key={item}
              selected={input.neededEquipment.includes(item)}
              onSelectedChange={(selected) => toggleEquipment(item, selected)}
            >
              {item}
            </Chip>
          ))}
        </div>
      </ProposalSection>

      <ProposalSection title="예상 소요시간">
        <Input
          type="number"
          value={input.durationHours}
          onChange={(e) => set("durationHours", Number(e.target.value))}
          className="w-32"
        />
      </ProposalSection>

      <ProposalSection title="안전 고려사항">
        <Textarea
          value={input.safetyNotes}
          onChange={(e) => set("safetyNotes", e.target.value)}
          placeholder="위험 요소와 대비 방법"
          rows={3}
        />
      </ProposalSection>

      {feedback && (
        <p role={feedback.kind === "error" ? "alert" : "status"} className={feedback.kind === "error" ? "text-sm text-destructive" : "text-sm text-primary"}>
          {feedback.text}
        </p>
      )}
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" disabled={pending !== null} onClick={handleSave}>
          {pending === "draft" ? "저장 중…" : "임시저장"}
        </Button>
        <Button type="button" disabled={pending !== null} onClick={handleSubmit}>
          {pending === "submit" ? "제출 중…" : "제출하기"}
        </Button>
      </div>
    </div>
  )
}

function ProposalForm(props: ProposalFormProps) {
  if (props.mode === "new") {
    return <NewProposalGate labId={props.labId} labName={props.labName} />
  }
  return <EditableProposalForm proposal={props.proposal} />
}

export { ProposalForm }
