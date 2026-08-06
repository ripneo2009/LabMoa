import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { firestore } from "@/lib/firebase/admin";
import type { FetchedPaper } from "@/lib/external/openalex";
import { recordFromSnapshot } from "./firestore-helpers";
import type { PaperRecord } from "./models";

const papers = firestore.collection("papers");

export async function findPapersByLabId(labId: string): Promise<PaperRecord[]> {
  const snapshot = await papers.where("labId", "==", labId).orderBy("publishedAt", "desc").get();
  return snapshot.docs.map((doc) => recordFromSnapshot<PaperRecord>(doc, "papers"));
}

export async function countPapers(): Promise<number> {
  return (await papers.count().get()).data().count;
}

export async function upsertPapers(labId: string, fetched: FetchedPaper[]): Promise<number> {
  const withDoi = fetched.filter((paper) => paper.doi);
  for (const paper of withDoi) {
    const doi = paper.doi!;
    const existing = await papers.where("doi", "==", doi).limit(1).get();
    const reference = existing.empty ? papers.doc() : existing.docs[0].ref;
    const now = FieldValue.serverTimestamp();
    await reference.set(
      {
        labId,
        title: paper.title,
        journal: paper.journal,
        publishedAt: Timestamp.fromDate(new Date(paper.publishedAt)),
        doi,
        url: paper.url,
        abstractSummary: paper.abstractSummary,
        tags: paper.tags,
        updatedAt: now,
        ...(existing.empty ? { createdAt: now } : {}),
      },
      { merge: true },
    );
  }
  return withDoi.length;
}

