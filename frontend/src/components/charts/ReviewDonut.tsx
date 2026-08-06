"use client"

// 멘토 대시보드용 검토중/수정요청/승인 비율 도넛 — 중앙에 총 건수 Counter
import * as React from "react"
import { motion } from "motion/react"

import { Counter } from "@/components/motion"
import { cn } from "@/lib/utils"
import { useInView } from "@/hooks/useInView"
import type { ReviewStatusBreakdown } from "@/lib/queries/stats"

export interface ReviewDonutProps {
  breakdown: ReviewStatusBreakdown
  size?: number
}

const RADIUS = 40
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const STROKE = 10

const SEGMENTS: { key: keyof ReviewStatusBreakdown; label: string; strokeClass: string; dotClass: string }[] = [
  { key: "submitted", label: "검토중", strokeClass: "stroke-primary", dotClass: "bg-primary" },
  { key: "revision", label: "수정요청", strokeClass: "stroke-warning", dotClass: "bg-warning" },
  { key: "approved", label: "승인", strokeClass: "stroke-success", dotClass: "bg-success" },
]

function ReviewDonut({ breakdown, size = 112 }: ReviewDonutProps) {
  const ref = React.useRef<SVGSVGElement>(null)
  const { inView, prefersReducedMotion: prefersReduced } = useInView(ref, { once: true })
  const total = breakdown.submitted + breakdown.revision + breakdown.approved

  let cumulative = 0

  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg ref={ref} width={size} height={size} viewBox="0 0 112 112" aria-hidden="true">
          <g transform="rotate(-90 56 56)">
            <circle cx="56" cy="56" r={RADIUS} strokeWidth={STROKE} className="fill-none stroke-border" />
            {total > 0 &&
              SEGMENTS.map((seg) => {
                const count = breakdown[seg.key]
                const length = (count / total) * CIRCUMFERENCE
                const offset = cumulative
                cumulative += length
                return (
                  <motion.circle
                    key={seg.key}
                    cx="56"
                    cy="56"
                    r={RADIUS}
                    strokeWidth={STROKE}
                    strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                    strokeDashoffset={-offset}
                    className={cn("fill-none", seg.strokeClass)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: inView || prefersReduced ? 1 : 0 }}
                    transition={{ duration: prefersReduced ? 0 : 0.5, ease: "easeOut" }}
                  />
                )
              })}
          </g>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-foreground">
          <Counter value={total} />
        </div>
      </div>

      <ul className="flex flex-col gap-1.5 text-sm">
        {SEGMENTS.map((seg) => (
          <li key={seg.key} className="flex items-center gap-2">
            <span className={cn("inline-block size-2.5 rounded-full", seg.dotClass)} aria-hidden />
            <span className="text-muted-foreground">{seg.label}</span>
            <span className="font-medium text-foreground">{breakdown[seg.key]}</span>
          </li>
        ))}
      </ul>

      {/* 표 형태 대체 텍스트 */}
      <table className="sr-only">
        <caption>검토 현황</caption>
        <tbody>
          {SEGMENTS.map((seg) => (
            <tr key={seg.key}>
              <th scope="row">{seg.label}</th>
              <td>{breakdown[seg.key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { ReviewDonut }
