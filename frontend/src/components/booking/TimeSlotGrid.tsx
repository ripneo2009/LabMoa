"use client"

// 30분 단위 시간 슬롯 — 시작 시간을 고르면 종료 시간 후보가 나타난다.
// 다른 예약과 겹치는 슬롯은 비활성화된다.
import { cn } from "@/lib/utils"
import type { Booking } from "@/types/booking"

export interface TimeSlotGridProps {
  bookedRanges: Pick<Booking, "startTime" | "endTime">[]
  selectedStart: string | null
  selectedEnd: string | null
  onSelectStart: (start: string) => void
  onSelectEnd: (end: string) => void
}

const OPEN_HOUR = 9
const CLOSE_HOUR = 18
const SLOT_MINUTES = 30

function generateSlots(): string[] {
  const slots: string[] = []
  for (let m = OPEN_HOUR * 60; m < CLOSE_HOUR * 60; m += SLOT_MINUTES) {
    const h = Math.floor(m / 60).toString().padStart(2, "0")
    const mm = (m % 60).toString().padStart(2, "0")
    slots.push(`${h}:${mm}`)
  }
  return slots
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number)
  const total = h * 60 + m + minutes
  const hh = Math.floor(total / 60)
    .toString()
    .padStart(2, "0")
  const mm = (total % 60).toString().padStart(2, "0")
  return `${hh}:${mm}`
}

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && bStart < aEnd
}

const SLOTS = generateSlots()
const CLOSE_TIME = `${CLOSE_HOUR.toString().padStart(2, "0")}:00`

function TimeSlotGrid({ bookedRanges, selectedStart, selectedEnd, onSelectStart, onSelectEnd }: TimeSlotGridProps) {
  function isStartDisabled(slot: string): boolean {
    const slotEnd = addMinutes(slot, SLOT_MINUTES)
    return bookedRanges.some((b) => rangesOverlap(slot, slotEnd, b.startTime, b.endTime))
  }

  const endOptions = selectedStart
    ? SLOTS.filter((s) => s > selectedStart)
        .map((s) => addMinutes(s, SLOT_MINUTES))
        .concat(CLOSE_TIME)
        .filter((v, i, arr) => arr.indexOf(v) === i)
    : []

  function isEndDisabled(end: string): boolean {
    if (!selectedStart) return true
    return bookedRanges.some((b) => rangesOverlap(selectedStart, end, b.startTime, b.endTime))
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">시작 시간</p>
        <div className="grid grid-cols-6 gap-1.5">
          {SLOTS.map((slot) => {
            const disabled = isStartDisabled(slot)
            const selected = slot === selectedStart
            return (
              <button
                key={slot}
                type="button"
                disabled={disabled}
                onClick={() => onSelectStart(slot)}
                className={cn(
                  "rounded-md border px-2 py-1.5 text-xs transition-colors duration-(--dur-fast)",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:border-primary/40",
                  disabled && "cursor-not-allowed opacity-30 hover:border-border",
                )}
              >
                {slot}
              </button>
            )
          })}
        </div>
      </div>

      {selectedStart && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">종료 시간</p>
          <div className="grid grid-cols-6 gap-1.5">
            {endOptions.map((end) => {
              const disabled = isEndDisabled(end)
              const selected = end === selectedEnd
              return (
                <button
                  key={end}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelectEnd(end)}
                  className={cn(
                    "rounded-md border px-2 py-1.5 text-xs transition-colors duration-(--dur-fast)",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-primary/40",
                    disabled && "cursor-not-allowed opacity-30 hover:border-border",
                  )}
                >
                  {end}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export { TimeSlotGrid, addMinutes, SLOT_MINUTES }
