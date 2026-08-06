// 멘토 검토 화면 — 좌측 계획서 전문 + 인라인 코멘트, 우측 sticky 안전 체크리스트
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui";
import { ProposalView, SafetyChecklist, StatusBadge } from "@/components/proposal";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getProposalById } from "@/lib/queries/proposals";

interface MentorReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function MentorReviewPage({ params }: MentorReviewPageProps) {
  const { id } = await params;
  const proposal = await getProposalById(id);
  if (!proposal) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "mentor" || proposal.mentorId !== user.mentorId) {
    notFound();
  }

  return (
    <div className="container-app grid grid-cols-1 gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{proposal.studentName}님의 계획서</h1>
            <p className="text-sm text-muted-foreground">{proposal.labName}</p>
          </div>
          <StatusBadge status={proposal.status} />
        </div>
        <Button asChild variant="outline" size="sm" className="self-start">
          <Link href={`/proposals/${proposal.id}/chat`}>학생과 채팅하기</Link>
        </Button>
        <ProposalView proposal={proposal} mode="mentor" />
      </div>

      {proposal.status === "submitted" ? (
        <SafetyChecklist proposalId={proposal.id} />
      ) : (
        <div className="text-sm text-muted-foreground lg:sticky lg:top-32">
          이 계획서는 현재 검토 대기 상태가 아니에요.
        </div>
      )}
    </div>
  );
}
