import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <div className="group/input relative">
      <textarea
        data-slot="textarea"
        className={cn(
          "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none transition-colors duration-(--dur-fast) ease-(--ease-out) placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className
        )}
        {...props}
      />
      {/* 포커스 시 하단 2px 밑줄이 scaleX(0→1)로 채워진다 (§3 Input 규칙과 동일하게 적용) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-(--dur-fast) ease-(--ease-out) group-focus-within/input:scale-x-100"
      />
    </div>
  )
}

export { Textarea }
