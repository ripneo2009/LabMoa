import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      // 무한 반복 애니메이션의 유일한 예외 (§4.1). opacity 0.5↔1, 1.4s
      className={cn(
        "animate-[pulse_1.4s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-md bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
