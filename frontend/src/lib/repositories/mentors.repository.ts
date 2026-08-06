import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { firestore } from "@/lib/firebase/admin";
import { recordFromSnapshot } from "./firestore-helpers";
import type { MentorRecord } from "./models";

const mentors = firestore.collection("mentors");

export async function findMentorById(id: string): Promise<MentorRecord | null> {
  const snapshot = await mentors.doc(id).get();
  return snapshot.exists ? recordFromSnapshot<MentorRecord>(snapshot, "mentors") : null;
}

export async function findMentorByUserId(userId: string): Promise<MentorRecord | null> {
  const snapshot = await mentors.where("userId", "==", userId).limit(1).get();
  return snapshot.empty ? null : recordFromSnapshot<MentorRecord>(snapshot.docs[0], "mentors");
}

export async function findFirstMentorByLabId(labId: string): Promise<MentorRecord | null> {
  const snapshot = await mentors.where("labId", "==", labId).limit(1).get();
  return snapshot.empty ? null : recordFromSnapshot<MentorRecord>(snapshot.docs[0], "mentors");
}

export async function findMentorsByLabId(labId: string): Promise<MentorRecord[]> {
  const snapshot = await mentors.where("labId", "==", labId).get();
  return snapshot.docs.map((doc) => recordFromSnapshot<MentorRecord>(doc, "mentors"));
}

export async function createMentor(
  input: Omit<MentorRecord, "id" | "createdAt" | "updatedAt">,
): Promise<MentorRecord> {
  const reference = mentors.doc();
  const now = FieldValue.serverTimestamp();
  await reference.create({ ...input, createdAt: now, updatedAt: now });
  return recordFromSnapshot<MentorRecord>(await reference.get(), "mentors");
}

