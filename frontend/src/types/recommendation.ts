export interface RecommendedInstitute {
  id: string;
  name: string;
  description: string;
  mapQuery: string;
}

export interface InstituteRecommendation {
  text: string;
  institutions: RecommendedInstitute[];
  source: "gemini" | "catalog";
}
