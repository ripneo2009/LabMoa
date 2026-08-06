import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { firestore } from "@/lib/firebase/admin";
import { recordFromSnapshot } from "./firestore-helpers";
import type { ReviewNoteRecord } from "./models";

const reviewNotes = firestore.collection("reviewNotes");

export async function findReviewNotesByProposalId(proposalId: string): Promise<ReviewNoteRecord[]> {
  const snapshot = await reviewNotes
    .where("proposalId", "==", proposalId)
    .orderBy("createdAt", "asc")
    .get();
  return snapshot.docs.map((doc) => recordFromSnapshot<ReviewNoteRecord>(doc, "reviewNotes"));
}

export async function createReviewNote(
  input: Omit<ReviewNoteRecord, "id" | "createdAt">,
): Promise<void> {
  await reviewNotes.add({ ...input, createdAt: FieldValue.serverTimestamp() });
}

export async function deleteReviewNote(id: string): Promise<void> {
  await reviewNotes.doc(id).delete();
}

