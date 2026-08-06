"use client"

// 주간 캘린더 — 한 주(일~토)를 보여주고 이전/다음 주로 이동한다. 과거 날짜는 선택할 수 없다.
import * as React from "react"

import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"

export interface WeekCalendarProps {
  selectedDate: string // "YYYY-MM-DD"
  onSelectDate: (date: string) => void
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"]

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

function WeekCalendar({ selectedDate, onSelectDate }: WeekCalendarProps) {
  const today = React.useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const [weekStart, setWeekStart] = React.useState(() => startOfWeek(new Date(selectedDate)))

  const days = React.useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart)
        d.setDate(d.getDate() + i)
        return d
      }),
    [weekStart],
  )

  function shiftWeek(offset: number) {
    const next = new Date(weekStart)
    next.setDate(next.getDate() + offset * 7)
    setWeekStart(next)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="sm" onClick={() => shiftWeek(-1)}>
          ◀ 이전주
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => shiftWeek(1)}>
          다음주 ▶
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, i) => {
          const key = toDateKey(day)
          const disabled = day < today
          const selected = key === selectedDate
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDate(key)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-sm transition-colors duration-(--dur-fast)",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:border-primary/40",
                disabled && "cursor-not-allowed opacity-40 hover:border-border",
              )}
            >
              <span className="text-xs">{WEEKDAY_LABELS[i]}</span>
              <span className="font-medium">{day.getDate()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { WeekCalendar }
