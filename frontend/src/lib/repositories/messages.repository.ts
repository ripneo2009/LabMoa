import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { firestore } from "@/lib/firebase/admin";
import { recordFromSnapshot } from "./firestore-helpers";
import type { MessageRecord } from "./models";

const messages = firestore.collection("messages");

export async function findMessagesByProposalId(proposalId: string): Promise<MessageRecord[]> {
  const snapshot = await messages
    .where("proposalId", "==", proposalId)
    .orderBy("createdAt", "asc")
    .get();
  return snapshot.docs.map((doc) => recordFromSnapshot<MessageRecord>(doc, "messages"));
}

export async function createMessage(
  input: Omit<MessageRecord, "id" | "createdAt">,
): Promise<void> {
  await messages.add({ ...input, createdAt: FieldValue.serverTimestamp() });
}

