"use client"

// 논문 탭 콘텐츠 — 연도별 막대 그래프 + "최종 업데이트" + 새로고침(OpenAlex 동기화) + 논문 카드 목록.
// 막대 hover 시 해당 연도 논문만 필터링한다 (§4.4).
import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui"
import { PaperTrendChart } from "@/components/charts"
import { Reveal } from "@/components/motion"
import { formatDateTime } from "@/lib/utils"
import type { Paper } from "@/types/lab"
import { PaperCard } from "./PaperCard"

export interface PaperListProps {
  labId: string
  papers: Paper[]
  lastUpdatedAt: string | null
  canSync: boolean
}

function formatUpdatedAt(iso: string | null): string {
  if (!iso) return "아직 동기화된 적 없음"
  return formatDateTime(iso)
}

function PaperList({ labId, papers, lastUpdatedAt, canSync }: PaperListProps) {
  const router = useRouter()
  const [hoveredYear, setHoveredYear] = React.useState<number | null>(null)
  const [syncing, setSyncing] = React.useState(false)

  const filtered = hoveredYear
    ? papers.filter((p) => new Date(p.publishedAt).getFullYear() === hoveredYear)
    : papers

  async function handleSync() {
    setSyncing(true)
    try {
      await fetch(`/api/papers/sync?labId=${labId}`, { method: "POST" })
      router.refresh()
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PaperTrendChart papers={papers} hoveredYear={hoveredYear} onHoverYear={setHoveredYear} />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>최종 업데이트: {formatUpdatedAt(lastUpdatedAt)}</span>
        {canSync && (
          <Button type="button" variant="ghost" size="sm" onClick={handleSync} disabled={syncing}>
            {syncing ? "가져오는 중…" : "최신 논문 가져오기"}
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {hoveredYear ? `${hoveredYear}년 논문이 없어요.` : "등록된 논문이 아직 없어요."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((paper, i) => (
            <Reveal key={paper.id} delay={i * 0.05}>
              <PaperCard paper={paper} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

export { PaperList }
