import { findMessagesByProposalId } from "@/lib/repositories/messages.repository";
import type { Message } from "@/types/proposal";

export async function getMessagesByProposalId(proposalId: string): Promise<Message[]> {
  return (await findMessagesByProposalId(proposalId)).map((row) => ({
    id: row.id,
    proposalId: row.proposalId,
    senderId: row.senderId,
    content: row.content,
    createdAt: row.createdAt.toDate().toISOString(),
  }));
}

