import { useEffect, useState } from "react";
import type { RecordsSource, WorkRecord } from "../../contracts/records";

type RecordsState =
  { kind: "loading" } | { kind: "ready"; rows: readonly WorkRecord[] } | { kind: "error" };

export function useRecords(source: RecordsSource, query: string, revision: number) {
  const [state, setState] = useState<RecordsState>({ kind: "loading" });
  useEffect(() => {
    let current = true;
    const controller = new AbortController();
    setState({ kind: "loading" });
    async function load() {
      try {
        const rows = await source.list(query, controller.signal);
        if (current) setState({ kind: "ready", rows });
      } catch {
        if (current) setState({ kind: "error" });
      }
    }
    void load();
    return () => {
      current = false;
      controller.abort();
    };
  }, [source, query, revision]);
  return state;
}
