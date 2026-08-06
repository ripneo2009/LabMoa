// 채팅 폴링 엔드포인트 — GET /api/messages?proposalId=xxx
import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/current-user";
import { getMessagesByProposalId } from "@/lib/queries/messages";
import { findProposalById } from "@/lib/repositories/proposals.repository";

export async function GET(request: NextRequest) {
  const proposalId = request.nextUrl.searchParams.get("proposalId");
  if (!proposalId) {
    return NextResponse.json({ error: "proposalId가 필요합니다." }, { status: 400 });
  }

  const proposal = await findProposalById(proposalId);
  if (!proposal) {
    return NextResponse.json({ error: "계획서를 찾을 수 없습니다." }, { status: 404 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  const isOwner = user.role === "student" && proposal.studentId === user.id;
  const isMentor = user.role === "mentor" && proposal.mentorId === user.mentorId;
  if (!isOwner && !isMentor) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const messages = await getMessagesByProposalId(proposalId);
  return NextResponse.json({ messages });
}
