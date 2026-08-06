import type { FetchedPaper } from "@/lib/external/openalex";
import { findPapersByLabId, upsertPapers } from "@/lib/repositories/papers.repository";
import type { Paper } from "@/types/lab";

export interface LabPapers {
  papers: Paper[];
  lastUpdatedAt: string | null;
}

export async function getPapersByLabId(labId: string): Promise<LabPapers> {
  const rows = await findPapersByLabId(labId);
  const papers = rows.map((row) => ({
    id: row.id,
    labId: row.labId,
    title: row.title,
    journal: row.journal,
    publishedAt: row.publishedAt.toDate().toISOString(),
    doi: row.doi,
    url: row.url,
    abstractSummary: row.abstractSummary,
    tags: row.tags,
  }));
  const lastUpdatedAt = rows.reduce<string | null>((latest, row) => {
    const updated = row.updatedAt.toDate().toISOString();
    return !latest || updated > latest ? updated : latest;
  }, null);
  return { papers, lastUpdatedAt };
}

export async function upsertPapersForLab(labId: string, papers: FetchedPaper[]): Promise<number> {
  return upsertPapers(labId, papers);
}

