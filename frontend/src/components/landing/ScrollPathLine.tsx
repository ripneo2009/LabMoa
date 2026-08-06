"use client"

// 스크롤 진행률에 따라 그려지는 세로 연결선 — SVG stroke-dashoffset(pathLength) 기반.
// 스크롤을 올리면 자연스럽게 역재생된다(값이 진행률에 직접 연동되어 있기 때문).
import { motion, type MotionValue } from "motion/react"

export interface ScrollPathLineProps {
  progress: MotionValue<number>
}

function ScrollPathLine({ progress }: ScrollPathLineProps) {
  return (
    <svg
      className="absolute left-4 top-0 h-full w-1 -translate-x-1/2"
      viewBox="0 0 4 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <line
        x1="2"
        y1="0"
        x2="2"
        y2="100"
        stroke="var(--border)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <motion.line
        x1="2"
        y1="0"
        x2="2"
        y2="100"
        stroke="var(--primary)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: progress }}
      />
    </svg>
  )
}

export { ScrollPathLine }
