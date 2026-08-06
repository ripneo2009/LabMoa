import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

import { researchInstitutes } from "@/data/research-institutes";
import type { RecommendedInstitute } from "@/types/recommendation";

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

interface RecommendRequest {
  query?: string;
  candidates?: RecommendedInstitute[];
}

interface GeminiRecommendation {
  ids?: string[];
  text?: string;
  equipment?: Record<string, string[]>;
}

function parseFirstJsonObject(text: string): GeminiRecommendation {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  const start = cleaned.indexOf("{");
  if (start < 0) throw new Error("Gemini returned no JSON object");
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < cleaned.length; index += 1) {
    const char = cleaned[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "{") depth += 1;
    else if (char === "}" && --depth === 0) {
      return JSON.parse(cleaned.slice(start, index + 1)) as GeminiRecommendation;
    }
  }
  throw new Error("Gemini returned incomplete JSON");
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const body = (await request.json().catch(() => ({}))) as RecommendRequest;
  const query = body.query?.trim() ?? "";
  const candidateInstitutions = body.candidates?.length
    ? body.candidates.slice(0, 100)
    : researchInstitutes;
  const fallbackInstitutions = shuffle(candidateInstitutions).slice(0, 3);
  const fallbackText = fallbackInstitutions
    .map(({ name, description }) => `${name} — ${description}`)
    .join("\n");

  if (candidateInstitutions.length === 0) {
    return NextResponse.json(
      { error: "현재 등록된 연구기관이 없습니다." },
      { status: 404 },
    );
  }

  if (!apiKey) {
    return NextResponse.json({ text: fallbackText, institutions: fallbackInstitutions, source: "catalog" });
  }

  try {
    const prompt = `당신은 한국어 연구실 안내 도우미입니다.
아래 실제 기관에 등록된 연구실 후보 중 최대 3곳을 가볍게 추천하세요. 사용자 조건은 고려하지 않아도 됩니다.

규칙:
- 반드시 제공된 후보 연구실 안에서만 추천하고, 없는 정보는 지어내지 마세요.
- 각 추천은 "기관명 · 연구실명 — 추천 이유" 형식으로 한 줄씩 작성하세요.
- 전체 답변은 간결한 한국어로 작성하고 마크다운 제목이나 표는 사용하지 마세요.

후보 연구실:
User search criteria: ${query || "No criteria provided"}

Select exactly three of the candidate institutions that best match the search criteria.
For every selected institution, infer 4 to 6 pieces of equipment that would commonly be needed for the user's research. These are estimates, not verified inventory.
Return JSON only in this shape: {"ids":["candidate-id"],"text":"A concise Korean explanation","equipment":{"candidate-id":["estimated equipment"]}}.
Use only IDs and facts present in the candidate list. Do not invent institutions.

${JSON.stringify(candidateInstitutions.map(({ id, name, description, equipment }) => ({ id, name, description, equipment })), null, 2)}`;

    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const parsed = parseFirstJsonObject(result.text ?? "");
    const selectedIds = new Set(parsed.ids?.slice(0, 3));
    const institutions = candidateInstitutions
      .filter(({ id }) => selectedIds.has(id))
      .map((institution) => {
        const estimatedEquipment = parsed.equipment?.[institution.id]
          ?.filter((item) => typeof item === "string" && item.trim())
          .slice(0, 6);
        return estimatedEquipment?.length
          ? { ...institution, equipment: estimatedEquipment, equipmentSource: "ai-estimate" as const }
          : institution;
      });
    const text = parsed.text?.trim();
    if (!text || institutions.length === 0) {
      throw new Error("Gemini returned an empty response");
    }

    return NextResponse.json({ text, institutions, source: "gemini" });
  } catch (error) {
    console.error("Gemini recommendation failed", error);
    return NextResponse.json({ text: fallbackText, institutions: fallbackInstitutions, source: "catalog" });
  }
}
