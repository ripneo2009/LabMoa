"use client"

// 계획서 작성 시작 게이트 — 페이지 진입만으로 draft가 생성되지 않도록 명시적 버튼을 둔다
import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui"
import { createProposal } from "@/lib/actions/proposal.actions"
import { getErrorMessage } from "@/lib/utils"

export interface NewProposalGateProps {
  labId: string
  labName: string
}

function NewProposalGate({ labId, labName }: NewProposalGateProps) {
  const router = useRouter()
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleStart() {
    setPending(true)
    setError(null)
    try {
      const id = await createProposal(labId)
      router.push(`/proposals/${id}`)
    } catch (caught) {
      setError(getErrorMessage(caught, "계획서를 시작하지 못했습니다."))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border p-10 text-center">
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{labName}</span>에 연구계획서를 작성합니다.
      </p>
      <Button type="button" onClick={handleStart} disabled={pending}>
        {pending ? "준비 중…" : "작성 시작하기"}
      </Button>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export { NewProposalGate }
