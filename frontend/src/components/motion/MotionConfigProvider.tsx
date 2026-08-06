"use client"

// motion(Framer Motion) 라이브러리는 자체 애니메이션 엔진(WAAPI)을 쓰기 때문에
// globals.css의 prefers-reduced-motion CSS 규칙이 적용되지 않는다. MotionConfig로
// 앱 전체의 transform/layout 애니메이션이 OS 설정을 따르도록 감싼다.
import { MotionConfig } from "motion/react"

function MotionConfigProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

export { MotionConfigProvider }
