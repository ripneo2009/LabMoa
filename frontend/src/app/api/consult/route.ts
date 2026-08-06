import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

interface ConsultRequest {
  labName?: string;
  contactName?: string;
  date?: string;
  experiment?: string;
  message?: string;
  history?: Array<{ sender: "user" | "contact"; text: string }>;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ConsultRequest;
  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "메시지를 입력해 주세요." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply: "문의 내용을 확인했습니다. 실험 조건과 필요한 장비를 조금 더 자세히 알려주세요.",
      source: "fallback",
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL ?? "gemini-3.5-flash",
      contents: `당신은 ${body.labName ?? "연구소"}의 예약 및 연구 상담 담당자 ${body.contactName ?? "담당자"}입니다.
사용자의 연구 계획을 구체화하도록 돕고 필요한 장비, 시료, 안전수칙, 예약 준비사항을 한국어로 간결하게 안내하세요.
실제 장비 보유 여부나 예약 확정을 단정하지 말고 담당자 확인이 필요하다고 안내하세요.
예약 희망일: ${body.date ?? "미정"}
실험 설명: ${body.experiment || "아직 입력하지 않음"}
최근 대화: ${JSON.stringify((body.history ?? []).slice(-6))}
사용자 메시지: ${message}`,
    });
    const reply = result.text?.trim();
    if (!reply) throw new Error("Empty Gemini consultation response");
    return NextResponse.json({ reply, source: "gemini" });
  } catch (error) {
    console.error("Gemini consultation failed", error);
    return NextResponse.json({
      reply: "문의 내용을 확인했습니다. 실험 목적, 시료 종류와 필요한 장비를 알려주시면 상담에 도움이 됩니다.",
      source: "fallback",
    });
  }
}
