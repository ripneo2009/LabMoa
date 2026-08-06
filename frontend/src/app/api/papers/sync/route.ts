// OpenAlex 논문 동기화 엔드포인트 — POST /api/papers/sync?labId=xxx
import { NextRequest, NextResponse } from "next/server";

import { getLabById } from "@/lib/queries/labs";
import { upsertPapersForLab } from "@/lib/queries/papers";
import { fetchOpenAlexPapers } from "@/lib/external/openalex";

export async function POST(request: NextRequest) {
  const labId = request.nextUrl.searchParams.get("labId");
  if (!labId) {
    return NextResponse.json({ error: "labId가 필요합니다." }, { status: 400 });
  }

  const lab = await getLabById(labId);
  if (!lab) {
    return NextResponse.json({ error: "연구실을 찾을 수 없습니다." }, { status: 404 });
  }
  if (!lab.openalexInstitutionId) {
    return NextResponse.json({ synced: 0, message: "OpenAlex 연동 정보가 없는 연구실입니다." });
  }

  try {
    const papers = await fetchOpenAlexPapers(lab.openalexInstitutionId);
    const synced = await upsertPapersForLab(lab.id, papers);
    return NextResponse.json({ synced });
  } catch (error) {
    // API 실패 시에도 기존 DB 캐시를 그대로 보여주면 되므로 500으로 서버를 죽이지 않는다
    return NextResponse.json(
      { synced: 0, error: error instanceof Error ? error.message : "동기화 실패" },
      { status: 502 },
    );
  }
}
