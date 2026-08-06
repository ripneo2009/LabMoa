export interface RecommendedInstitute {
  id: string;
  name: string;
  description: string;
  mapQuery: string;
  equipment?: string[];
  address?: string;
  lat?: number;
  lng?: number;
}

export interface InstituteRecommendation {
  text: string;
  institutions: RecommendedInstitute[];
  source: "gemini" | "catalog";
}

export interface RecommendedPaper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publishedAt: string;
  doi: string | null;
  url: string;
  tags: string[];
  summary: string;
}

export interface PaperRecommendation {
  query: string;
  papers: RecommendedPaper[];
  source: "gemini" | "openalex";
}
