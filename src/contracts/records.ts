export type WorkRecord = {
  id: string;
  name: string;
  category: "Document" | "Checklist" | "Reference";
  owner: string;
  status: "Ready" | "Draft" | "Archived";
  updated: string;
};

export interface RecordsSource {
  list(query: string, signal: AbortSignal): Promise<readonly WorkRecord[]>;
}
