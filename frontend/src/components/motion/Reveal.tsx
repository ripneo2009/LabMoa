"use client"

// 뷰포트 진입 시 1회만 실행되는 등장 모션 (IntersectionObserver 기반, 재실행 없음)
import * as React from "react"
import { motion } from "motion/react"

import { DURATION, EASE } from "@/lib/constants/motion"

export interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: DURATION.base, ease: EASE.out, delay }}
    >
      {children}
    </motion.div>
  )
}

export { Reveal }
