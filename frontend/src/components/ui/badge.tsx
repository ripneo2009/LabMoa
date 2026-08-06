"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import type { HTMLMotionProps } from "motion/react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { DURATION, EASE } from "@/lib/constants/motion"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        success: "bg-success/10 text-success dark:bg-success/20",
        warning: "bg-warning/10 text-warning dark:bg-warning/20",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  if (asChild) {
    return (
      <Slot.Root
        data-slot="badge"
        data-variant={variant}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {children}
      </Slot.Root>
    )
  }

  // 텍스트 변경 시 crossfade, 너비 변화는 motion layout으로 처리 (§3 Badge 규칙)
  const crossfadeKey =
    typeof children === "string" || typeof children === "number"
      ? children
      : undefined

  return (
    <motion.span
      data-slot="badge"
      data-variant={variant}
      layout
      transition={{ duration: DURATION.fast, ease: EASE.out }}
      className={cn(badgeVariants({ variant }), className)}
      {...(props as HTMLMotionProps<"span">)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={crossfadeKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE.out }}
          className="inline-flex items-center gap-1"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

export { Badge, badgeVariants }
