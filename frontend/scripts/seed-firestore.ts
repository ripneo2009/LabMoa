import bcrypt from "bcryptjs";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { firestore } from "../src/lib/firebase/admin-base";
import { labsData } from "../src/data/seed/labs.data";
import { mentorsData } from "../src/data/seed/mentors.data";
import { papersData } from "../src/data/seed/papers.data";
import {
  demoMessages,
  demoProposals,
  demoReviewNotes,
  demoStudents,
} from "../src/data/seed/demo.data";

const DEMO_PASSWORD = "eumlab1234";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const batch = firestore.batch();
  const timestamp = FieldValue.serverTimestamp();

  for (const lab of labsData) {
    batch.set(firestore.collection("labs").doc(lab.id), {
      ...lab, createdAt: timestamp, updatedAt: timestamp,
    }, { merge: true });
  }
  for (const mentor of mentorsData) {
    batch.set(firestore.collection("users").doc(mentor.userId), {
      role: "mentor", name: mentor.userName, email: mentor.userEmail,
      emailNormalized: mentor.userEmail.toLowerCase(), passwordHash,
      googleUid: null,
      org: mentor.userOrg, phone: mentor.userPhone, createdAt: timestamp, updatedAt: timestamp,
    }, { merge: true });
    batch.set(firestore.collection("mentors").doc(mentor.id), {
      userId: mentor.userId, labId: mentor.labId, degree: mentor.degree, field: mentor.field,
      bio: mentor.bio, researchKeywords: mentor.researchKeywords, responseRate: mentor.responseRate,
      createdAt: timestamp, updatedAt: timestamp,
    }, { merge: true });
  }
  for (const paper of papersData) {
    batch.set(firestore.collection("papers").doc(paper.id), {
      ...paper,
      publishedAt: Timestamp.fromDate(new Date(paper.publishedAt)),
      createdAt: timestamp,
      updatedAt: timestamp,
    }, { merge: true });
  }
  for (const student of demoStudents) {
    batch.set(firestore.collection("users").doc(student.id), {
      ...student, role: "student", emailNormalized: student.email.toLowerCase(), passwordHash,
      googleUid: null,
      createdAt: timestamp, updatedAt: timestamp,
    }, { merge: true });
  }
  for (const proposal of demoProposals) {
    batch.set(firestore.collection("proposals").doc(proposal.id), {
      ...proposal, createdAt: timestamp, updatedAt: timestamp,
    }, { merge: true });
  }
  for (const note of demoReviewNotes) {
    batch.set(firestore.collection("reviewNotes").doc(note.id), {
      ...note, createdAt: timestamp,
    }, { merge: true });
  }
  for (const message of demoMessages) {
    batch.set(firestore.collection("messages").doc(message.id), {
      ...message, createdAt: timestamp,
    }, { merge: true });
  }

  await batch.commit();
  console.info("Firestore demo data seeded successfully.");
}

main().catch((error) => {
  console.error("Firestore seed failed:", error);
  process.exitCode = 1;
});
