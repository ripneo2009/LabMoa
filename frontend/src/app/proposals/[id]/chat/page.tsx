// 채팅 페이지 — 계획서의 학생 또는 담당 멘토만 접근 가능
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ChatThread } from "@/components/chat";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getMessagesByProposalId } from "@/lib/queries/messages";
import { getProposalById } from "@/lib/queries/proposals";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const proposal = await getProposalById(id);
  if (!proposal) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const isOwner = user.role === "student" && proposal.studentId === user.id;
  const isMentor = user.role === "mentor" && proposal.mentorId === user.mentorId;
  if (!isOwner && !isMentor) notFound();

  const messages = await getMessagesByProposalId(id);
  const backHref = isMentor ? `/mentor/proposals/${id}` : `/proposals/${id}`;

  return (
    <div className="container-app flex max-w-2xl flex-col gap-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">채팅</h1>
        <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground">
          ← 계획서로
        </Link>
      </div>

      <ChatThread
        proposalId={id}
        currentUserId={user.id}
        initialMessages={messages}
        otherPersonName={isMentor ? proposal.studentName : (proposal.mentorName ?? "멘토 미배정")}
        otherPersonSubtitle={proposal.labName}
      />
    </div>
  );
}
