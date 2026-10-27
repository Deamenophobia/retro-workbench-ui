import type { RecordsSource, WorkRecord } from "../contracts/records";

function validRecord(value: unknown): value is WorkRecord {
  if (typeof value !== "object" || value === null) return false;
  const row = value as Partial<WorkRecord>;
  return (
    typeof row.id === "string" &&
    row.id.length > 0 &&
    typeof row.name === "string" &&
    typeof row.owner === "string" &&
    typeof row.updated === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(row.updated) &&
    (row.category === "Document" || row.category === "Checklist" || row.category === "Reference") &&
    (row.status === "Ready" || row.status === "Draft" || row.status === "Archived")
  );
}

export function parseRecords(value: unknown): readonly WorkRecord[] {
  if (!Array.isArray(value) || !value.every(validRecord))
    throw new Error("Invalid records response");
  if (new Set(value.map((row) => row.id)).size !== value.length)
    throw new Error("Duplicate record IDs");
  return value;
}

export function createRecordsSource(url: string, request: typeof fetch = fetch): RecordsSource {
  return {
    async list(query, signal) {
      const response = await request(url, { signal });
      if (!response.ok) throw new Error("Records request failed");
      const body: unknown = await response.json();
      signal.throwIfAborted();
      const search = query.trim().toLowerCase();
      return parseRecords(body).filter((row) =>
        `${row.id} ${row.name} ${row.owner}`.toLowerCase().includes(search),
      );
    },
  };
}
