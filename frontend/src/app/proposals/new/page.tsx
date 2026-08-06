// 계획서 작성 시작 페이지 — labId를 받아 시작 게이트를 보여준다 (draft는 버튼 클릭 시에만 생성)
import { notFound, redirect } from "next/navigation";

import { ProposalForm } from "@/components/proposal";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getLabById } from "@/lib/queries/labs";

interface NewProposalPageProps {
  searchParams: Promise<{ labId?: string }>;
}

export default async function NewProposalPage({ searchParams }: NewProposalPageProps) {
  const { labId } = await searchParams;
  if (!labId) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") notFound();

  const lab = await getLabById(labId);
  if (!lab) notFound();

  return (
    <div className="container-app max-w-2xl py-10">
      <ProposalForm mode="new" labId={lab.id} labName={lab.name} />
    </div>
  );
}
