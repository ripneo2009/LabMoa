import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { firestore } from "@/lib/firebase/admin";
import { normalizedEmail, recordFromSnapshot } from "./firestore-helpers";
import type { MentorRecord, UserRecord } from "./models";

export async function createMentorAccount(
  userInput: Omit<UserRecord, "id" | "emailNormalized" | "createdAt" | "updatedAt">,
  mentorInput: Omit<MentorRecord, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<{ user: UserRecord; mentor: MentorRecord }> {
  const userReference = firestore.collection("users").doc();
  const mentorReference = firestore.collection("mentors").doc();
  await firestore.runTransaction(async (transaction) => {
    const now = FieldValue.serverTimestamp();
    transaction.create(userReference, {
      ...userInput,
      email: userInput.email.trim(),
      emailNormalized: normalizedEmail(userInput.email),
      createdAt: now,
      updatedAt: now,
    });
    transaction.create(mentorReference, {
      ...mentorInput,
      userId: userReference.id,
      createdAt: now,
      updatedAt: now,
    });
  });
  const [userSnapshot, mentorSnapshot] = await Promise.all([
    userReference.get(),
    mentorReference.get(),
  ]);
  return {
    user: recordFromSnapshot<UserRecord>(userSnapshot, "users"),
    mentor: recordFromSnapshot<MentorRecord>(mentorSnapshot, "mentors"),
  };
}

