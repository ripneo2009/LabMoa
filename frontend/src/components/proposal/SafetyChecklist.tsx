"use client"

// 안전 체크리스트 5항목 — 전부 체크해야 승인 버튼이 활성화된다.
// Button은 이미 disabled→enabled 전환 시 1회 spring pulse를 자체 지원한다 (Phase 3).
import * as React from "react"
import { useRouter } from "next/navigation"

import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox } from "@/components/ui"
import { isSafetyPassed, SAFETY_ITEMS } from "@/lib/domain/safety"
import { approveProposal, rejectProposal, requestRevision } from "@/lib/actions/review.actions"
import { getErrorMessage } from "@/lib/utils"

export interface SafetyChecklistProps {
  proposalId: string
}

function SafetyChecklist({ proposalId }: SafetyChecklistProps) {
  const router = useRouter()
  const [checked, setChecked] = React.useState<string[]>([])
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const passed = isSafetyPassed(checked)

  function toggle(item: string, value: boolean) {
    setChecked((prev) => (value ? [...prev, item] : prev.filter((i) => i !== item)))
  }

  async function run(action: () => Promise<void>) {
    setPending(true)
    setError(null)
    try {
      await action()
      router.refresh()
    } catch (caught) {
      setError(getErrorMessage(caught, "검토 상태를 변경하지 못했습니다."))
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="lg:sticky lg:top-32">
      <CardHeader>
        <CardTitle>안전 체크리스트</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ul className="flex flex-col gap-3">
          {SAFETY_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <Checkbox
                id={`safety-${item}`}
                checked={checked.includes(item)}
                onCheckedChange={(value) => toggle(item, value === true)}
              />
              <label htmlFor={`safety-${item}`} className="text-sm text-foreground">
                {item}
              </label>
            </li>
          ))}
        </ul>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        <Button
          type="button"
          disabled={!passed || pending}
          onClick={() => run(() => approveProposal(proposalId, checked))}
        >
          승인
        </Button>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={pending}
            onClick={() => run(() => requestRevision(proposalId))}
          >
            수정 요청
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            disabled={pending}
            onClick={() => run(() => rejectProposal(proposalId))}
          >
            반려
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { SafetyChecklist }
