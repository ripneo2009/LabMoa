import "server-only";

import { firestore } from "@/lib/firebase/admin";
import type { Region } from "@/lib/constants/regions";
import { recordFromSnapshot } from "./firestore-helpers";
import type { LabRecord } from "./models";

const labs = firestore.collection("labs");

export async function findLabById(id: string): Promise<LabRecord | null> {
  const snapshot = await labs.doc(id).get();
  return snapshot.exists ? recordFromSnapshot<LabRecord>(snapshot, "labs") : null;
}

export async function findLabs(region?: Region | null): Promise<LabRecord[]> {
  const query = region ? labs.where("region", "==", region) : labs;
  const snapshot = await query.get();
  return snapshot.docs
    .map((doc) => recordFromSnapshot<LabRecord>(doc, "labs"))
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

export async function countLabs(): Promise<number> {
  return (await labs.count().get()).data().count;
}

