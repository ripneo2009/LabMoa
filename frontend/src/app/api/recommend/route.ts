import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

import { researchInstitutes } from "@/data/research-institutes";

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY;
  const institutions = shuffle(researchInstitutes).slice(0, 3);
  const fallbackText = institutions
    .map(({ name, description }) => `${name} — ${description}`)
    .join("\n");

  if (institutions.length === 0) {
    return NextResponse.json(
      { error: "현재 등록된 연구기관이 없습니다." },
      { status: 404 },
    );
  }

  if (!apiKey) {
    return NextResponse.json({ text: fallbackText, institutions, source: "catalog" });
  }

  try {
    const prompt = `당신은 한국어 연구실 안내 도우미입니다.
아래 실제 기관에 등록된 연구실 후보 중 최대 3곳을 가볍게 추천하세요. 사용자 조건은 고려하지 않아도 됩니다.

규칙:
- 반드시 제공된 후보 연구실 안에서만 추천하고, 없는 정보는 지어내지 마세요.
- 각 추천은 "기관명 · 연구실명 — 추천 이유" 형식으로 한 줄씩 작성하세요.
- 전체 답변은 간결한 한국어로 작성하고 마크다운 제목이나 표는 사용하지 마세요.

후보 연구실:
${JSON.stringify(institutions.map(({ name, description }) => ({ name, description })), null, 2)}`;

    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
      contents: prompt,
    });

    const text = result.text?.trim();
    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    return NextResponse.json({ text, institutions, source: "gemini" });
  } catch (error) {
    console.error("Gemini recommendation failed", error);
    return NextResponse.json({ text: fallbackText, institutions, source: "catalog" });
  }
}
