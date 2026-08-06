import { findLabById } from "@/lib/repositories/labs.repository";
import { findMentorById } from "@/lib/repositories/mentors.repository";
import { findProposalById, findProposalsByLabId } from "@/lib/repositories/proposals.repository";
import { findReviewNotesByProposalId } from "@/lib/repositories/review-notes.repository";
import { findUserById } from "@/lib/repositories/users.repository";
import type { Proposal, ProposalDetail, ProposalSummary, ReviewNote } from "@/types/proposal";
import type { ProposalRecord } from "@/lib/repositories/models";

function toProposal(row: ProposalRecord): Proposal {
  return {
    id: row.id,
    studentId: row.studentId,
    labId: row.labId,
    mentorId: row.mentorId,
    title: row.title,
    motivation: row.motivation,
    hypothesis: row.hypothesis,
    method: row.method,
    neededMaterials: row.neededMaterials,
    neededEquipment: row.neededEquipment,
    durationHours: row.durationHours,
    safetyNotes: row.safetyNotes,
    status: row.status,
    version: row.version,
    createdAt: row.createdAt.toDate().toISOString(),
    updatedAt: row.updatedAt.toDate().toISOString(),
  };
}

function toReviewNote(row: Awaited<ReturnType<typeof findReviewNotesByProposalId>>[number]): ReviewNote {
  return {
    id: row.id,
    proposalId: row.proposalId,
    authorId: row.authorId,
    targetField: row.targetField,
    comment: row.comment,
    severity: row.severity,
    createdAt: row.createdAt.toDate().toISOString(),
  };
}

export async function getProposalById(id: string): Promise<ProposalDetail | null> {
  const row = await findProposalById(id);
  if (!row) return null;
  const [student, lab, mentor, reviewNotes] = await Promise.all([
    findUserById(row.studentId),
    findLabById(row.labId),
    row.mentorId ? findMentorById(row.mentorId) : null,
    findReviewNotesByProposalId(row.id),
  ]);
  const mentorUser = mentor ? await findUserById(mentor.userId) : null;
  return {
    ...toProposal(row),
    studentName: student?.name ?? "알 수 없는 학생",
    labName: lab?.name ?? "알 수 없는 연구실",
    mentorName: mentorUser?.name ?? null,
    reviewNotes: reviewNotes.map(toReviewNote),
  };
}

export async function getProposalsByLabId(labId: string): Promise<ProposalSummary[]> {
  const rows = await findProposalsByLabId(labId);
  return Promise.all(
    rows.map(async (row) => {
      const [student, lab] = await Promise.all([findUserById(row.studentId), findLabById(row.labId)]);
      return {
        ...toProposal(row),
        studentName: student?.name ?? "알 수 없는 학생",
        labName: lab?.name ?? "알 수 없는 연구실",
      };
    }),
  );
}

