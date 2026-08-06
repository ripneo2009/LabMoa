import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

import type { PaperRecommendation, RecommendedPaper } from "@/types/recommendation";

interface OpenAlexWork {
  id: string;
  title: string;
  publication_date?: string;
  doi?: string;
  primary_location?: {
    landing_page_url?: string;
    source?: { display_name?: string };
  };
  authorships?: Array<{ author?: { display_name?: string } }>;
  abstract_inverted_index?: Record<string, number[]>;
  concepts?: Array<{ display_name: string }>;
}

interface OpenAlexResponse {
  results?: OpenAlexWork[];
}

type GeminiSummary = { id: string; summary: string };
interface GeminiSummaries { summaries?: GeminiSummary[] }

function reconstructAbstract(index?: Record<string, number[]>): string | null {
  if (!index) return null;
  const words: string[] = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const position of positions) words[position] = word;
  }
  return words.join(" ").trim() || null;
}

function excerpt(text: string | null): string {
  if (!text) return "OpenAlex에 등록된 초록이 없어 요약을 제공할 수 없습니다.";
  const shortened = text.length > 420 ? `${text.slice(0, 420)}...` : text;
  return `초록 발췌: ${shortened}`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { query?: string };
  const query = body.query?.trim() ?? "";
  if (!query) {
    return NextResponse.json({ error: "연구 주제나 키워드를 입력해 주세요." }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      search: query,
      filter: "has_abstract:true",
      sort: "relevance_score:desc",
      "per-page": "5",
    });
    const response = await fetch(`https://api.openalex.org/works?${params}`, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "LabMoa/1.0 (paper recommendations)" },
    });
    if (!response.ok) throw new Error(`OpenAlex request failed: ${response.status}`);

    const data = (await response.json()) as OpenAlexResponse;
    const works = (data.results ?? []).filter((work) => work.id && work.title);
    if (works.length === 0) {
      return NextResponse.json({ error: "관련 논문을 찾지 못했습니다. 검색어를 조금 더 구체적으로 입력해 주세요." }, { status: 404 });
    }

    const abstracts = new Map(works.map((work) => [work.id, reconstructAbstract(work.abstract_inverted_index)]));
    let source: PaperRecommendation["source"] = "openalex";
    const summaries = new Map<string, string>();
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const result = await ai.models.generateContent({
          model: process.env.GEMINI_MODEL ?? "gemini-3.5-flash",
          contents: `다음은 OpenAlex에서 검색된 실제 논문의 제목과 초록입니다. 각 논문의 핵심 연구 목적, 방법, 결과를 초록에 있는 내용만으로 한국어 2~3문장으로 요약하세요. 정보가 없으면 추측하지 마세요. JSON만 반환하세요.\n\n${JSON.stringify(works.map((work) => ({ id: work.id, title: work.title, abstract: abstracts.get(work.id) })))}`,
          config: { responseMimeType: "application/json" },
        });
        const parsed = JSON.parse(result.text ?? "{}") as GeminiSummaries | GeminiSummary[];
        const items = Array.isArray(parsed) ? parsed : parsed.summaries ?? [];
        for (const item of items) {
          if (item.id && item.summary?.trim()) summaries.set(item.id, item.summary.trim());
        }
        if (summaries.size > 0) source = "gemini";
      } catch (error) {
        console.error("Gemini paper summary failed", error);
      }
    }

    const papers: RecommendedPaper[] = works.map((work) => {
      const openAlexUrl = work.id.startsWith("http") ? work.id : `https://openalex.org/${work.id}`;
      return {
        id: work.id,
        title: work.title,
        authors: (work.authorships ?? []).flatMap(({ author }) => author?.display_name ? [author.display_name] : []).slice(0, 5),
        journal: work.primary_location?.source?.display_name ?? "학술 출처 미상",
        publishedAt: work.publication_date ?? "발행일 미상",
        doi: work.doi ?? null,
        url: work.doi ?? work.primary_location?.landing_page_url ?? openAlexUrl,
        tags: (work.concepts ?? []).slice(0, 4).map(({ display_name }) => display_name),
        summary: summaries.get(work.id) ?? excerpt(abstracts.get(work.id) ?? null),
      };
    });

    return NextResponse.json({ query, papers, source } satisfies PaperRecommendation);
  } catch (error) {
    console.error("Paper recommendation failed", error);
    return NextResponse.json({ error: "논문 검색 서비스에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  }
}
