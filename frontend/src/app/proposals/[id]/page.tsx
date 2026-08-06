// 학생 계획서 상세 — draft/revision이면 편집 폼, 그 외에는 읽기 전용 + 인라인 코멘트
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui";
import {
  ProposalForm,
  ProposalStepper,
  ProposalView,
  SafetyVideoPanel,
  StatusBadge,
  VersionHistory,
} from "@/components/proposal";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getBookingByProposalId } from "@/lib/queries/bookings";
import { getProposalById } from "@/lib/queries/proposals";

interface ProposalDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProposalDetailPage({ params }: ProposalDetailPageProps) {
  const { id } = await params;
  const proposal = await getProposalById(id);
  if (!proposal) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "student" && proposal.studentId !== user.id) {
    notFound();
  }

  const isEditable = proposal.status === "draft" || proposal.status === "revision";
  const booking = await getBookingByProposalId(id);

  return (
    <>
      <ProposalStepper status={proposal.status} booked={Boolean(booking)} />
      <div className="container-app grid grid-cols-1 gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex max-w-2xl flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-foreground">{proposal.labName}</h1>
              <p className="text-sm text-muted-foreground">담당 멘토 {proposal.mentorName ?? "미배정"}</p>
            </div>
            <StatusBadge status={proposal.status} />
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/proposals/${id}/chat`}>멘토와 채팅하기</Link>
            </Button>
            {proposal.status === "approved" && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/proposals/${id}/booking`}>{booking ? "예약 확인하기" : "일정 예약하기"}</Link>
              </Button>
            )}
          </div>

          {isEditable ? (
            <ProposalForm mode="edit" proposal={proposal} />
          ) : (
            <ProposalView proposal={proposal} mode="student" />
          )}

          <VersionHistory version={proposal.version} reviewNotes={proposal.reviewNotes} />
        </div>

        <SafetyVideoPanel />
      </div>
    </>
  );
}
