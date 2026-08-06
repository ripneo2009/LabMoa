"use client"

// 예약 위저드 상태 컨테이너 — 날짜/시간 선택과 비용 계산, 예약 확정 액션을 이어준다.
import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui"
import { createBooking } from "@/lib/actions/booking.actions"
import type { Booking } from "@/types/booking"
import type { MaterialItem } from "@/types/proposal"
import { WeekCalendar } from "./WeekCalendar"
import { TimeSlotGrid, addMinutes } from "./TimeSlotGrid"
import { CostSummary } from "./CostSummary"

export interface BookingWizardProps {
  proposalId: string
  hourlyRate: number
  materials: MaterialItem[]
  defaultDurationHours: number
  /** 연구실 전체 예약(다른 계획서 포함) — 날짜별로 필터링해 슬롯 충돌을 막는다 */
  allBookings: Booking[]
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function hoursBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)
  return (eh * 60 + em - (sh * 60 + sm)) / 60
}

function BookingWizard({ proposalId, hourlyRate, materials, defaultDurationHours, allBookings }: BookingWizardProps) {
  const router = useRouter()
  const [date, setDate] = React.useState(todayKey())
  const [start, setStart] = React.useState<string | null>(null)
  const [end, setEnd] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const bookedRanges = allBookings.filter((b) => b.date.slice(0, 10) === date)
  const hours = start && end ? hoursBetween(start, end) : 0

  function handleSelectDate(next: string) {
    setDate(next)
    setStart(null)
    setEnd(null)
  }

  function handleSelectStart(next: string) {
    setStart(next)
    setEnd(addMinutes(next, defaultDurationHours * 60))
  }

  async function handleConfirm() {
    if (!start || !end) return
    setPending(true)
    setError(null)
    try {
      await createBooking({ proposalId, date, startTime: start, endTime: end })
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "예약에 실패했습니다.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <WeekCalendar selectedDate={date} onSelectDate={handleSelectDate} />
      <TimeSlotGrid
        bookedRanges={bookedRanges}
        selectedStart={start}
        selectedEnd={end}
        onSelectStart={handleSelectStart}
        onSelectEnd={setEnd}
      />
      {hours > 0 && <CostSummary hours={hours} hourlyRate={hourlyRate} materials={materials} />}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="button" disabled={!start || !end || pending} onClick={handleConfirm}>
        {pending ? "예약 확정 중…" : "예약 확정"}
      </Button>
    </div>
  )
}

export { BookingWizard }
