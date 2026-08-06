import "server-only";

import type { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";

export function recordFromSnapshot<T extends { id: string }>(
  snapshot: DocumentSnapshot | QueryDocumentSnapshot,
  collectionName: string,
): T {
  const data = snapshot.data();
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid ${collectionName} document: ${snapshot.id}`);
  }
  return { ...data, id: snapshot.id } as T;
}

export function normalizedEmail(email: string): string {
  return email.trim().toLowerCase();
}

