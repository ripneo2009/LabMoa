import { Timestamp } from "firebase-admin/firestore";
import { Client } from "pg";

import { firestore } from "../src/lib/firebase/admin-base";

type Row = Record<string, unknown>;

const TABLE_COLLECTIONS = [
  ["User", "users"],
  ["Lab", "labs"],
  ["Mentor", "mentors"],
  ["Paper", "papers"],
  ["Proposal", "proposals"],
  ["ReviewNote", "reviewNotes"],
  ["Booking", "bookings"],
  ["Message", "messages"],
] as const;

const ARRAY_FIELDS: Record<string, string[]> = {
  labs: ["fieldTags", "equipment"],
  mentors: ["researchKeywords"],
  papers: ["tags"],
  proposals: ["neededMaterials", "neededEquipment"],
};
const DATE_FIELDS: Record<string, string[]> = {
  users: ["createdAt", "updatedAt"], labs: ["createdAt", "updatedAt"],
  mentors: ["createdAt", "updatedAt"], papers: ["publishedAt", "createdAt", "updatedAt"],
  proposals: ["createdAt", "updatedAt"], reviewNotes: ["createdAt"],
  bookings: ["date", "createdAt", "updatedAt"], messages: ["createdAt"],
};

function parseArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error("Expected a JSON array in legacy data.");
  return parsed;
}

function transformRow(collection: string, original: Row, proposals: Map<string, Row>): Row {
  const row = { ...original };
  for (const field of ARRAY_FIELDS[collection] ?? []) row[field] = parseArray(row[field]);
  for (const field of DATE_FIELDS[collection] ?? []) {
    if (row[field]) row[field] = Timestamp.fromDate(new Date(row[field] as string | number | Date));
  }
  if (collection === "users" && typeof row.email === "string") {
    row.emailNormalized = row.email.trim().toLowerCase();
    row.googleUid = null;
  }
  if (collection === "bookings") {
    const proposal = proposals.get(String(row.proposalId));
    if (!proposal) throw new Error(`Booking ${row.id} references a missing proposal.`);
    row.labId = proposal.labId;
    row.studentId = proposal.studentId;
  }
  delete row.id;
  return row;
}

async function readTable(client: Client, table: string): Promise<Row[]> {
  const safeTable = TABLE_COLLECTIONS.find(([candidate]) => candidate === table)?.[0];
  if (!safeTable) throw new Error(`Unsupported legacy table: ${table}`);
  const result = await client.query(`SELECT * FROM "${safeTable}"`);
  return result.rows as Row[];
}

async function main() {
  const connectionString = process.env.LEGACY_DATABASE_URL;
  if (!connectionString) throw new Error("LEGACY_DATABASE_URL is required.");
  if (process.env.CONFIRM_FIRESTORE_MIGRATION !== "yes") {
    throw new Error("Set CONFIRM_FIRESTORE_MIGRATION=yes after backing up the source database.");
  }

  const client = new Client({ connectionString });
  await client.connect();
  try {
    const tableRows = new Map<string, Row[]>();
    for (const [table, collection] of TABLE_COLLECTIONS) {
      const rows = await readTable(client, table);
      tableRows.set(collection, rows);
      console.info(`Read ${rows.length} rows from ${table}.`);
    }
    const proposals = new Map(
      (tableRows.get("proposals") ?? []).map((row) => [String(row.id), row]),
    );
    let batch = firestore.batch();
    let operationCount = 0;
    for (const [, collection] of TABLE_COLLECTIONS) {
      for (const row of tableRows.get(collection) ?? []) {
        const id = String(row.id);
        batch.set(
          firestore.collection(collection).doc(id),
          transformRow(collection, row, proposals),
          { merge: true },
        );
        operationCount += 1;
        if (operationCount % 400 === 0) {
          await batch.commit();
          batch = firestore.batch();
        }
      }
    }
    if (operationCount % 400 !== 0) await batch.commit();
    console.info(`Migrated ${operationCount} documents. The PostgreSQL source was not modified.`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});
