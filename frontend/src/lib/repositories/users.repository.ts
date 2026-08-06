import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { firestore } from "@/lib/firebase/admin";
import { normalizedEmail, recordFromSnapshot } from "./firestore-helpers";
import type { UserRecord } from "./models";

const users = firestore.collection("users");

export async function findUserById(id: string): Promise<UserRecord | null> {
  const snapshot = await users.doc(id).get();
  return snapshot.exists ? recordFromSnapshot<UserRecord>(snapshot, "users") : null;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const snapshot = await users.where("emailNormalized", "==", normalizedEmail(email)).limit(1).get();
  return snapshot.empty ? null : recordFromSnapshot<UserRecord>(snapshot.docs[0], "users");
}

export async function findUserByGoogleUid(googleUid: string): Promise<UserRecord | null> {
  const snapshot = await users.where("googleUid", "==", googleUid).limit(1).get();
  return snapshot.empty ? null : recordFromSnapshot<UserRecord>(snapshot.docs[0], "users");
}

export async function linkGoogleIdentity(userId: string, googleUid: string): Promise<void> {
  await users.doc(userId).update({ googleUid, updatedAt: FieldValue.serverTimestamp() });
}

export async function createUser(
  input: Omit<UserRecord, "id" | "emailNormalized" | "createdAt" | "updatedAt">,
): Promise<UserRecord> {
  const reference = users.doc();
  const now = FieldValue.serverTimestamp();
  await reference.create({
    ...input,
    email: input.email.trim(),
    emailNormalized: normalizedEmail(input.email),
    createdAt: now,
    updatedAt: now,
  });
  const created = await reference.get();
  return recordFromSnapshot<UserRecord>(created, "users");
}
