"use client"

// 16px 아래에서 페이드업하며 등장하는 모션 래퍼
import type { HTMLMotionProps } from "motion/react"
import { motion } from "motion/react"

import { DURATION, EASE } from "@/lib/constants/motion"

export interface FadeUpProps extends HTMLMotionProps<"div"> {
  delay?: number
}

/**
 * 마운트 시 즉시 재생되는 페이드업(뷰포트 트리거 없음). 스크롤 진입 시점에 맞춰
 * 1회만 실행하고 싶다면 Reveal을 사용할 것.
 */
function FadeUp({ children, delay = 0, transition, ...props }: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE.out, delay, ...transition }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export { FadeUp }
