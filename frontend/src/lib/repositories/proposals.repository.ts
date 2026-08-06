import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { firestore } from "@/lib/firebase/admin";
import type { ProposalStatus } from "@/types/proposal";
import { recordFromSnapshot } from "./firestore-helpers";
import type { ProposalRecord } from "./models";

const proposals = firestore.collection("proposals");

export async function findProposalById(id: string): Promise<ProposalRecord | null> {
  const snapshot = await proposals.doc(id).get();
  return snapshot.exists ? recordFromSnapshot<ProposalRecord>(snapshot, "proposals") : null;
}

export async function findProposalsByLabId(labId: string): Promise<ProposalRecord[]> {
  const snapshot = await proposals.where("labId", "==", labId).orderBy("updatedAt", "desc").get();
  return snapshot.docs.map((doc) => recordFromSnapshot<ProposalRecord>(doc, "proposals"));
}

export async function findProposalsByStatuses(statuses: ProposalStatus[]): Promise<ProposalRecord[]> {
  const snapshot = await proposals.where("status", "in", statuses).get();
  return snapshot.docs.map((doc) => recordFromSnapshot<ProposalRecord>(doc, "proposals"));
}

export async function createProposalRecord(
  input: Omit<ProposalRecord, "id" | "createdAt" | "updatedAt">,
): Promise<ProposalRecord> {
  const reference = proposals.doc();
  const now = FieldValue.serverTimestamp();
  await reference.create({ ...input, createdAt: now, updatedAt: now });
  return recordFromSnapshot<ProposalRecord>(await reference.get(), "proposals");
}

export async function updateProposalRecord(
  id: string,
  changes: Partial<Omit<ProposalRecord, "id" | "createdAt" | "updatedAt">>,
): Promise<void> {
  await proposals.doc(id).update({ ...changes, updatedAt: FieldValue.serverTimestamp() });
}

