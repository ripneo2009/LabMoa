"use client"

// 목표값까지 1200ms 카운트업 (easeOutExpo, 천단위 콤마). prefers-reduced-motion에서는 즉시 최종값을 표시한다.
import * as React from "react"

import { useInView } from "@/hooks/useInView"
import { useCountUp } from "@/hooks/useCountUp"

export interface CounterProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

function Counter({ value, decimals = 0, prefix = "", suffix = "", className }: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const { inView, prefersReducedMotion } = useInView(ref, { once: true })
  const display = useCountUp(value, inView, prefersReducedMotion)

  const formatted = display.toLocaleString("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

export { Counter }
