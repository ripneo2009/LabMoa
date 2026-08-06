"use client"

// 원형 매칭도 게이지 — score(0~100)에 따라 색이 바뀌고 옆에 근거 텍스트를 함께 보여준다.
// (Phase 8 차트 스펙 중 하나지만, 검색 결과 카드(Phase 4)가 곧바로 필요로 해 앞당겨 구현했다.)
import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { useInView } from "@/hooks/useInView"

export interface MatchGaugeProps {
  score: number
  reasons: string[]
  size?: number
  className?: string
}

const RADIUS = 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function scoreColorClass(score: number): string {
  if (score >= 80) return "stroke-success"
  if (score >= 50) return "stroke-primary"
  return "stroke-muted-foreground"
}

function MatchGauge({ score, reasons, size = 56, className }: MatchGaugeProps) {
  const ref = React.useRef<SVGSVGElement>(null)
  const { inView, prefersReducedMotion: prefersReduced } = useInView(ref, { once: true })
  const clamped = Math.max(0, Math.min(100, Math.round(score)))

  const targetOffset = CIRCUMFERENCE * (1 - clamped / 100)
  const reasonText = reasons.length > 0 ? reasons.join(" · ") : "매칭 근거 없음"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg ref={ref} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <g transform="rotate(-90 20 20)">
          <circle cx="20" cy="20" r={RADIUS} strokeWidth="4" className="fill-none stroke-border" />
          <motion.circle
            cx="20"
            cy="20"
            r={RADIUS}
            strokeWidth="4"
            strokeLinecap="round"
            className={cn("fill-none", scoreColorClass(clamped))}
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: inView || prefersReduced ? targetOffset : CIRCUMFERENCE }}
            transition={{ duration: prefersReduced ? 0 : 0.8, ease: "easeOut" }}
          />
        </g>
        <text
          x="20"
          y="21"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-[10px] font-semibold"
        >
          {clamped}
        </text>
      </svg>
      {/* 시각 요소(SVG)는 장식용으로 숨기고, 이 텍스트가 실제 접근 가능한 정보를 담는다 */}
      <span className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{clamped}%</span> · {reasonText}
      </span>
    </div>
  )
}

export { MatchGauge }
