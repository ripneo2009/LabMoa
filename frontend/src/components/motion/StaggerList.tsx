"use client"

// 자식이 60ms(모바일 40ms) 간격으로 순차 등장하는 리스트 컨테이너 + 아이템
import { motion } from "motion/react"

import { DURATION, EASE } from "@/lib/constants/motion"
import { useResponsiveStagger } from "@/hooks/useResponsiveStagger"

export interface StaggerListProps {
  children: React.ReactNode
  className?: string
  as?: "div" | "ul"
}

function StaggerList({ children, className, as = "div" }: StaggerListProps) {
  const stagger = useResponsiveStagger()
  const Container = as === "ul" ? motion.ul : motion.div

  return (
    <Container
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </Container>
  )
}

export interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  as?: "div" | "li"
}

function StaggerItem({ children, className, as = "div" }: StaggerItemProps) {
  const Item = as === "li" ? motion.li : motion.div

  return (
    <Item
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.out } },
      }}
    >
      {children}
    </Item>
  )
}

export { StaggerList, StaggerItem }
