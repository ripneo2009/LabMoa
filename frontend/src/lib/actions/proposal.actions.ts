"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/current-user";
import { nextStatus } from "@/lib/domain/proposal-state";
import { findFirstMentorByLabId } from "@/lib/repositories/mentors.repository";
import {
  createProposalRecord,
  findProposalById,
  updateProposalRecord,
} from "@/lib/repositories/proposals.repository";
import type { MaterialItem } from "@/types/proposal";

export interface ProposalInput {
  title: string;
  motivation: string;
  hypothesis: string;
  method: string;
  neededMaterials: MaterialItem[];
  neededEquipment: string[];
  durationHours: number;
  safetyNotes: string;
}

const EMPTY_INPUT: ProposalInput = {
  title: "", motivation: "", hypothesis: "", method: "", neededMaterials: [],
  neededEquipment: [], durationHours: 1, safetyNotes: "",
};

function validateProposalInput(input: ProposalInput): void {
  if (!Number.isFinite(input.durationHours) || input.durationHours <= 0) {
    throw new Error("실험 시간은 0보다 커야 합니다.");
  }
  if (input.neededMaterials.some((item) => !item.name.trim() || item.unitPrice < 0 || item.qty < 0)) {
    throw new Error("재료명, 가격, 수량을 올바르게 입력해주세요.");
  }
}

export async function createProposal(labId: string): Promise<string> {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") throw new Error("학생만 계획서를 작성할 수 있습니다.");
  const mentor = await findFirstMentorByLabId(labId);
  const proposal = await createProposalRecord({
    ...EMPTY_INPUT,
    studentId: user.id,
    labId,
    mentorId: mentor?.id ?? null,
    status: "draft",
    version: 1,
  });
  return proposal.id;
}

async function assertOwnsProposal(proposalId: string, studentId: string) {
  const proposal = await findProposalById(proposalId);
  if (!proposal || proposal.studentId !== studentId) {
    throw new Error("본인 계획서만 수정할 수 있습니다.");
  }
  return proposal;
}

export async function saveProposalDraft(proposalId: string, input: ProposalInput): Promise<void> {
  validateProposalInput(input);
  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  const proposal = await assertOwnsProposal(proposalId, user.id);
  if (proposal.status !== "draft" && proposal.status !== "revision") {
    throw new Error("작성 중이거나 수정 요청 상태에서만 저장할 수 있습니다.");
  }
  await updateProposalRecord(proposalId, input);
  revalidatePath(`/proposals/${proposalId}`);
}

export async function submitProposal(proposalId: string, input: ProposalInput): Promise<void> {
  validateProposalInput(input);
  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  const proposal = await assertOwnsProposal(proposalId, user.id);
  const next = nextStatus("submit", proposal.status);
  if (!next) throw new Error("현재 상태에서는 제출할 수 없습니다.");
  await updateProposalRecord(proposalId, {
    ...input,
    status: next,
    version: proposal.status === "revision" ? proposal.version + 1 : proposal.version,
  });
  revalidatePath(`/proposals/${proposalId}`);
  revalidatePath(`/mentor/proposals/${proposalId}`);
  revalidatePath("/mentor");
}

