"use client"

// 연도별 논문 수 막대 그래프 — scaleY(0→1, transform-origin: bottom), 80ms stagger.
// 막대에 hover/focus 시 해당 연도를 부모에 알려 목록을 필터링할 수 있게 한다.
// (Phase 8 차트 스펙 중 하나지만, 논문 탭(Phase 5)이 곧바로 필요로 해 앞당겨 구현했다.)
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import type { Paper } from "@/types/lab"

export interface PaperTrendChartProps {
  papers: Paper[]
  hoveredYear: number | null
  onHoverYear: (year: number | null) => void
  className?: string
}

const YEARS_TO_SHOW = 3

function PaperTrendChart({ papers, hoveredYear, onHoverYear, className }: PaperTrendChartProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    { length: YEARS_TO_SHOW },
    (_, i) => currentYear - (YEARS_TO_SHOW - 1) + i,
  )
  const counts = years.map(
    (year) => papers.filter((p) => new Date(p.publishedAt).getFullYear() === year).length,
  )
  const max = Math.max(1, ...counts)

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex h-32 items-end gap-4">
        {years.map((year, i) => {
          const count = counts[i]
          const ratio = count === 0 ? 0.02 : count / max
          return (
            <button
              key={year}
              type="button"
              onMouseEnter={() => onHoverYear(year)}
              onMouseLeave={() => onHoverYear(null)}
              onFocus={() => onHoverYear(year)}
              onBlur={() => onHoverYear(null)}
              className="flex flex-1 flex-col items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label={`${year}년 논문 ${count}편`}
            >
              <div className="flex h-24 w-full items-end justify-center">
                <motion.div
                  className={cn(
                    "w-8 origin-bottom rounded-t-sm",
                    hoveredYear === year ? "bg-primary" : "bg-primary/60",
                  )}
                  style={{ height: "100%" }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: ratio }}
                  transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.08 }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{year}</span>
            </button>
          )
        })}
      </div>
      {/* 표 형태 대체 텍스트 (모든 차트에 aria-label + 표 대체 텍스트 제공 원칙, §8-A) */}
      <table className="sr-only">
        <caption>연도별 논문 수</caption>
        <thead>
          <tr>
            <th scope="col">연도</th>
            <th scope="col">논문 수</th>
          </tr>
        </thead>
        <tbody>
          {years.map((year, i) => (
            <tr key={year}>
              <td>{year}</td>
              <td>{counts[i]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { PaperTrendChart }
