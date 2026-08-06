import { calcMatchScore } from "@/lib/domain/match-score";
import { findLabById, findLabs } from "@/lib/repositories/labs.repository";
import { findMentorsByLabId } from "@/lib/repositories/mentors.repository";
import { findPapersByLabId } from "@/lib/repositories/papers.repository";
import { findUserById } from "@/lib/repositories/users.repository";
import type { Lab, LabDetail, LabSearchResult, Mentor, Paper, SearchFilters } from "@/types/lab";

function toLab(record: Awaited<ReturnType<typeof findLabById>> & {}): Lab {
  return {
    id: record.id,
    name: record.name,
    org: record.org,
    address: record.address,
    region: record.region,
    lat: record.lat,
    lng: record.lng,
    fieldTags: record.fieldTags,
    equipment: record.equipment,
    safetyLevel: record.safetyLevel,
    hourlyRate: record.hourlyRate,
    materialPolicy: record.materialPolicy,
    description: record.description,
    openalexInstitutionId: record.openalexInstitutionId,
  };
}

export async function searchLabs(filters: SearchFilters): Promise<LabSearchResult[]> {
  const labs = await findLabs(filters.region);
  const results = await Promise.all(
    labs.map(async (lab): Promise<LabSearchResult> => {
      const [mentors, papers] = await Promise.all([
        findMentorsByLabId(lab.id),
        findPapersByLabId(lab.id),
      ]);
      const { score, reasons } = calcMatchScore(
        filters.fields,
        lab.fieldTags,
        filters.equipment,
        lab.equipment,
      );
      return {
        ...toLab(lab),
        matchScore: score,
        matchReasons: reasons,
        recentPaperCount: papers.length,
        mentorDegree: mentors[0]?.degree ?? null,
      };
    }),
  );
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export interface LabOption {
  id: string;
  name: string;
  org: string;
}

export async function getAllLabOptions(): Promise<LabOption[]> {
  return (await findLabs()).map(({ id, name, org }) => ({ id, name, org }));
}

export async function getLabById(id: string): Promise<LabDetail | null> {
  const lab = await findLabById(id);
  if (!lab) return null;

  const [mentorRecords, paperRecords] = await Promise.all([
    findMentorsByLabId(id),
    findPapersByLabId(id),
  ]);
  const mentorUsers = await Promise.all(mentorRecords.map((mentor) => findUserById(mentor.userId)));

  const mentors: Mentor[] = mentorRecords.map((mentor, index) => ({
    id: mentor.id,
    userId: mentor.userId,
    name: mentorUsers[index]?.name ?? "알 수 없는 멘토",
    labId: mentor.labId,
    degree: mentor.degree,
    field: mentor.field,
    bio: mentor.bio,
    researchKeywords: mentor.researchKeywords,
    responseRate: mentor.responseRate,
  }));
  const papers: Paper[] = paperRecords.map((paper) => ({
    id: paper.id,
    labId: paper.labId,
    title: paper.title,
    journal: paper.journal,
    publishedAt: paper.publishedAt.toDate().toISOString(),
    doi: paper.doi,
    url: paper.url,
    abstractSummary: paper.abstractSummary,
    tags: paper.tags,
  }));

  return { ...toLab(lab), mentors, papers };
}

