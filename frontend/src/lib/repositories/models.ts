import type { Timestamp } from "firebase-admin/firestore";

import type { Region } from "@/lib/constants/regions";
import type { Field } from "@/lib/constants/fields";
import type { SafetyLevel } from "@/lib/constants/safety-level";
import type { BookingStatus, MentorDegree, Role } from "@/types";
import type {
  MaterialItem,
  ProposalStatus,
  ReviewSeverity,
  ReviewTargetField,
} from "@/types/proposal";

export interface UserRecord {
  id: string;
  role: Role;
  name: string;
  email: string;
  emailNormalized: string;
  passwordHash: string | null;
  googleUid: string | null;
  org: string | null;
  phone: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LabRecord {
  id: string;
  name: string;
  org: string;
  address: string;
  region: Region;
  lat: number;
  lng: number;
  fieldTags: Field[];
  equipment: string[];
  safetyLevel: SafetyLevel;
  hourlyRate: number;
  materialPolicy: string;
  description: string;
  openalexInstitutionId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MentorRecord {
  id: string;
  userId: string;
  labId: string;
  degree: MentorDegree;
  field: string;
  bio: string;
  researchKeywords: string[];
  responseRate: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PaperRecord {
  id: string;
  labId: string;
  title: string;
  journal: string;
  publishedAt: Timestamp;
  doi: string | null;
  url: string | null;
  abstractSummary: string | null;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProposalRecord {
  id: string;
  studentId: string;
  labId: string;
  mentorId: string | null;
  title: string;
  motivation: string;
  hypothesis: string;
  method: string;
  neededMaterials: MaterialItem[];
  neededEquipment: string[];
  durationHours: number;
  safetyNotes: string;
  status: ProposalStatus;
  version: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ReviewNoteRecord {
  id: string;
  proposalId: string;
  authorId: string;
  targetField: ReviewTargetField;
  comment: string;
  severity: ReviewSeverity;
  createdAt: Timestamp;
}

export interface BookingRecord {
  id: string;
  proposalId: string;
  labId: string;
  studentId: string;
  date: Timestamp;
  startTime: string;
  endTime: string;
  rentalFee: number;
  materialFee: number;
  totalFee: number;
  status: BookingStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MessageRecord {
  id: string;
  proposalId: string;
  senderId: string;
  content: string;
  createdAt: Timestamp;
}
