// 멘토 대시보드 — 본인 랩에 제출된 계획서 목록 (상태별로 묶어서 표시)
import Link from "next/link";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { ReviewDonut } from "@/components/charts";
import { StatusBadge } from "@/components/proposal";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getProposalsByLabId } from "@/lib/queries/proposals";
import { getReviewBreakdownByLabId } from "@/lib/queries/stats";
import type { ProposalStatus, ProposalSummary } from "@/types/proposal";

const SECTION_ORDER: { status: ProposalStatus; label: string }[] = [
  { status: "submitted", label: "검토 대기" },
  { status: "revision", label: "수정 요청됨" },
  { status: "approved", label: "승인됨" },
  { status: "rejected", label: "반려됨" },
  { status: "draft", label: "작성 중(학생 임시저장)" },
];

function ProposalRow({ proposal }: { proposal: ProposalSummary }) {
  return (
    <Link
      href={`/mentor/proposals/${proposal.id}`}
      className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 transition-colors duration-(--dur-fast) hover:border-primary/40"
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{proposal.title || "(제목 없음)"}</span>
        <span className="text-xs text-muted-foreground">{proposal.studentName}</span>
      </div>
      <StatusBadge status={proposal.status} />
    </Link>
  );
}

export default async function MentorDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role !== "mentor" || !user.labId) {
    return (
      <div className="container-app py-10 text-sm text-muted-foreground">
        멘토 계정으로 로그인해야 검토할 계획서 목록을 볼 수 있어요.
      </div>
    );
  }

  const [proposals, breakdown] = await Promise.all([
    getProposalsByLabId(user.labId),
    getReviewBreakdownByLabId(user.labId),
  ]);

  return (
    <div className="container-app flex flex-col gap-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <h1 className="text-2xl font-semibold text-foreground">멘토 대시보드</h1>
        <ReviewDonut breakdown={breakdown} />
      </div>

      {proposals.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 제출된 계획서가 없어요.</p>
      ) : (
        SECTION_ORDER.map(({ status, label }) => {
          const items = proposals.filter((p) => p.status === status);
          if (items.length === 0) return null;
          return (
            <Card key={status}>
              <CardHeader>
                <CardTitle>
                  {label} ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {items.map((proposal) => (
                  <ProposalRow key={proposal.id} proposal={proposal} />
                ))}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
