// 예약 페이지 — approved 상태에서만 접근 가능. 이미 예약이 있으면 확인 화면을 보여준다.
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { BookingConfirm, BookingWizard } from "@/components/booking";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getBookedSlotsForLab, getBookingByProposalId } from "@/lib/queries/bookings";
import { getLabById } from "@/lib/queries/labs";
import { getProposalById } from "@/lib/queries/proposals";

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  const proposal = await getProposalById(id);
  if (!proposal) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student" || proposal.studentId !== user.id) {
    notFound();
  }

  if (proposal.status !== "approved") {
    return (
      <div className="container-app max-w-2xl py-10">
        <p className="text-sm text-muted-foreground">
          이 계획서는 아직 승인되지 않아 예약할 수 없어요.{" "}
          <Link href={`/proposals/${id}`} className="text-primary underline-offset-2 hover:underline">
            계획서로 돌아가기
          </Link>
        </p>
      </div>
    );
  }

  const lab = await getLabById(proposal.labId);
  if (!lab) notFound();

  const existingBooking = await getBookingByProposalId(id);

  return (
    <div className="container-app flex max-w-2xl flex-col gap-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{lab.name} 예약</h1>
        <Link href={`/proposals/${id}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← 계획서로
        </Link>
      </div>

      {existingBooking ? (
        <BookingConfirm
          booking={existingBooking}
          labName={lab.name}
          labAddress={lab.address}
          materials={proposal.neededMaterials}
          safetyNotes={proposal.safetyNotes}
        />
      ) : (
        <BookingWizard
          proposalId={id}
          hourlyRate={lab.hourlyRate}
          materials={proposal.neededMaterials}
          defaultDurationHours={proposal.durationHours}
          allBookings={await getBookedSlotsForLab(proposal.labId)}
        />
      )}
    </div>
  );
}
