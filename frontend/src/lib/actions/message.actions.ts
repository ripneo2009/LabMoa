"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/current-user";
import { createMessage } from "@/lib/repositories/messages.repository";
import { findProposalById } from "@/lib/repositories/proposals.repository";

export async function sendMessage(proposalId: string, content: string): Promise<void> {
  const trimmed = content.trim();
  if (!trimmed) return;
  if (trimmed.length > 4000) throw new Error("메시지는 4,000자 이하로 입력해주세요.");
  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  const proposal = await findProposalById(proposalId);
  if (!proposal) throw new Error("계획서를 찾을 수 없습니다.");
  const isOwner = user.role === "student" && proposal.studentId === user.id;
  const isMentor = user.role === "mentor" && proposal.mentorId === user.mentorId;
  if (!isOwner && !isMentor) throw new Error("이 계획서의 채팅에 참여할 수 없습니다.");
  await createMessage({ proposalId, senderId: user.id, content: trimmed });
  revalidatePath(`/proposals/${proposalId}/chat`);
}

