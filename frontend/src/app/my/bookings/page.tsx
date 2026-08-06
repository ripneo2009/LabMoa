// 내 예약 내역 — 로그인한 학생이 지금까지 확정한 모든 예약을 최신순으로 보여준다
import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getBookingsByStudentId } from "@/lib/queries/bookings";
import type { BookingStatus, BookingWithContext } from "@/types/booking";

const STATUS_LABEL: Record<BookingStatus, { label: string; variant: "warning" | "success" | "secondary" }> = {
  pending: { label: "대기중", variant: "warning" },
  confirmed: { label: "확정", variant: "success" },
  done: { label: "완료", variant: "secondary" },
};

function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

function BookingRow({ booking }: { booking: BookingWithContext }) {
  const status = STATUS_LABEL[booking.status];
  return (
    <Link
      href={`/proposals/${booking.proposalId}/booking`}
      className="flex flex-col gap-2 rounded-lg border border-border p-4 transition-colors duration-(--dur-fast) hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{booking.labName}</span>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{booking.proposalTitle}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(booking.date)} · {booking.startTime}~{booking.endTime}
        </p>
      </div>
      <p className="text-sm font-medium text-foreground">{formatCurrency(booking.totalFee)}</p>
    </Link>
  );
}

export default async function MyBookingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect("/mentor");

  const bookings = await getBookingsByStudentId(user.id);

  return (
    <div className="container-app flex flex-col gap-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">내 예약 내역</h1>
        <p className="text-sm text-muted-foreground">지금까지 확정한 실험 예약을 모아봤어요.</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>아직 예약이 없어요</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              연구실을 찾아 계획서를 제출하고 승인받으면 이곳에서 예약 내역을 확인할 수 있어요.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
