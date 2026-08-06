// 예약 확인 화면 — 예약이 이미 생성된 뒤 보여주는 읽기 전용 안내
import { CostBreakdownBar } from "@/components/charts";
import type { Booking } from "@/types/booking";
import type { MaterialItem } from "@/types/proposal";

export interface BookingConfirmProps {
  booking: Booking;
  labName: string;
  labAddress: string;
  materials: MaterialItem[];
  safetyNotes: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function BookingConfirm({ booking, labName, labAddress, materials, safetyNotes }: BookingConfirmProps) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border p-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-success">예약이 확정되었습니다</p>
        <p className="text-lg font-semibold text-foreground">
          {formatDate(booking.date)} {booking.startTime} ~ {booking.endTime}
        </p>
      </div>

      <CostBreakdownBar rental={booking.rentalFee} material={booking.materialFee} total={booking.totalFee} />

      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">집합 장소</span> · {labName} ({labAddress})
        </p>
        {materials.length > 0 && (
          <p>
            <span className="font-medium text-foreground">준비물</span> ·{" "}
            {materials.map((m) => m.name).join(", ")}
          </p>
        )}
        <p>
          <span className="font-medium text-foreground">주의사항</span> · {safetyNotes}
        </p>
      </div>

      <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
        비용은 온라인 결제 없이 현장에서 정산합니다.
      </p>
    </div>
  );
}

export { BookingConfirm };
