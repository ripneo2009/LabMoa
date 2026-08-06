"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/current-user";
import { nextStatus, type ProposalAction } from "@/lib/domain/proposal-state";
import { isSafetyPassed } from "@/lib/domain/safety";
import { findProposalById, updateProposalRecord } from "@/lib/repositories/proposals.repository";
import { createReviewNote, deleteReviewNote as removeReviewNote } from "@/lib/repositories/review-notes.repository";
import type { ReviewSeverity, ReviewTargetField } from "@/types/proposal";

async function assertMentorOwnsProposal(proposalId: string, mentorId: string | null) {
  const proposal = await findProposalById(proposalId);
  if (!proposal || !mentorId || proposal.mentorId !== mentorId) {
    throw new Error("본인 랩의 계획서만 검토할 수 있습니다.");
  }
  return proposal;
}

function revalidateProposal(proposalId: string) {
  revalidatePath(`/mentor/proposals/${proposalId}`);
  revalidatePath(`/proposals/${proposalId}`);
  revalidatePath("/mentor");
}

export async function addReviewNote(
  proposalId: string,
  targetField: ReviewTargetField,
  comment: string,
  severity: ReviewSeverity,
): Promise<void> {
  const trimmed = comment.trim();
  if (!trimmed) throw new Error("검토 의견을 입력해주세요.");
  const user = await getCurrentUser();
  if (!user || user.role !== "mentor") throw new Error("멘토만 코멘트를 남길 수 있습니다.");
  await assertMentorOwnsProposal(proposalId, user.mentorId);
  await createReviewNote({ proposalId, authorId: user.id, targetField, comment: trimmed, severity });
  revalidateProposal(proposalId);
}

export async function deleteReviewNote(noteId: string, proposalId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "mentor") throw new Error("멘토만 코멘트를 삭제할 수 있습니다.");
  await assertMentorOwnsProposal(proposalId, user.mentorId);
  await removeReviewNote(noteId);
  revalidateProposal(proposalId);
}

async function transition(proposalId: string, action: ProposalAction, safetyPassed = false) {
  const user = await getCurrentUser();
  if (!user || user.role !== "mentor") throw new Error("멘토만 검토 상태를 변경할 수 있습니다.");
  const proposal = await assertMentorOwnsProposal(proposalId, user.mentorId);
  const next = nextStatus(action, proposal.status, { safetyPassed });
  if (!next) throw new Error("현재 상태에서는 처리할 수 없습니다.");
  await updateProposalRecord(proposalId, { status: next });
  revalidateProposal(proposalId);
}

export async function requestRevision(proposalId: string) { await transition(proposalId, "request_revision"); }
export async function approveProposal(proposalId: string, checkedItems: string[]) {
  if (!isSafetyPassed(checkedItems)) throw new Error("안전 체크리스트를 모두 통과해야 승인할 수 있습니다.");
  await transition(proposalId, "approve", true);
}
export async function rejectProposal(proposalId: string) { await transition(proposalId, "reject"); }

