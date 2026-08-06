import { countLabs } from "@/lib/repositories/labs.repository";
import { countPapers } from "@/lib/repositories/papers.repository";
import { findProposalsByLabId, findProposalsByStatuses } from "@/lib/repositories/proposals.repository";

export interface PlatformStats {
  labCount: number;
  paperCount: number;
  avgReviewDays: number;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const [labCount, paperCount, decidedProposals] = await Promise.all([
    countLabs(),
    countPapers(),
    findProposalsByStatuses(["approved", "rejected"]),
  ]);
  const avgReviewDays = decidedProposals.length
    ? decidedProposals.reduce((sum, proposal) => {
        const milliseconds = proposal.updatedAt.toMillis() - proposal.createdAt.toMillis();
        return sum + milliseconds / (1000 * 60 * 60 * 24);
      }, 0) / decidedProposals.length
    : 0;
  return { labCount, paperCount, avgReviewDays: Math.round(avgReviewDays * 10) / 10 };
}

export interface ReviewStatusBreakdown {
  submitted: number;
  revision: number;
  approved: number;
}

export async function getReviewBreakdownByLabId(labId: string): Promise<ReviewStatusBreakdown> {
  const proposals = await findProposalsByLabId(labId);
  const breakdown: ReviewStatusBreakdown = { submitted: 0, revision: 0, approved: 0 };
  for (const proposal of proposals) {
    if (proposal.status in breakdown) {
      breakdown[proposal.status as keyof ReviewStatusBreakdown] += 1;
    }
  }
  return breakdown;
}

