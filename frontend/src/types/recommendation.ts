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
