// OpenAlex REST API — 연구실 소속 기관의 최신 논문을 수집한다 (무료, API 키 불필요)
export interface FetchedPaper {
  title: string;
  journal: string;
  publishedAt: string;
  doi: string | null;
  url: string | null;
  abstractSummary: string | null;
  tags: string[];
}

interface OpenAlexWork {
  title: string;
  primary_location?: { source?: { display_name?: string } };
  publication_date: string;
  doi?: string;
  abstract_inverted_index?: Record<string, number[]>;
  concepts?: { display_name: string }[];
}

interface OpenAlexWorksResponse {
  results: OpenAlexWork[];
}

/** "https://openalex.org/I76519962" 형태의 URL에서 짧은 ID만 추출한다. */
function extractShortId(institutionId: string): string {
  const parts = institutionId.split("/");
  return parts[parts.length - 1];
}

const ABSTRACT_MAX_LENGTH = 200;

function reconstructAbstract(index?: Record<string, number[]>): string | null {
  if (!index) return null;
  const words: string[] = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const pos of positions) words[pos] = word;
  }
  const text = words.join(" ").trim();
  if (!text) return null;
  return text.length > ABSTRACT_MAX_LENGTH
    ? `${text.slice(0, ABSTRACT_MAX_LENGTH)}…`
    : text;
}

/**
 * 기관의 최신 논문 목록을 OpenAlex에서 가져온다.
 * @param institutionId Lab.openalexInstitutionId (OpenAlex 기관 URL)
 * @param limit 가져올 논문 수
 */
export async function fetchOpenAlexPapers(
  institutionId: string,
  limit = 5,
): Promise<FetchedPaper[]> {
  const shortId = extractShortId(institutionId);
  const url = `https://api.openalex.org/works?filter=institutions.id:${shortId}&sort=publication_date:desc&per-page=${limit}`;

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) {
    throw new Error(`OpenAlex 조회 실패: ${response.status}`);
  }

  const data = (await response.json()) as OpenAlexWorksResponse;

  return data.results.map((work) => ({
    title: work.title,
    journal: work.primary_location?.source?.display_name ?? "미상",
    publishedAt: work.publication_date,
    doi: work.doi ?? null,
    url: work.doi ?? null,
    abstractSummary: reconstructAbstract(work.abstract_inverted_index),
    tags: (work.concepts ?? []).slice(0, 3).map((c) => c.display_name),
  }));
}
