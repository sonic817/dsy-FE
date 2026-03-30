import { useState, useEffect } from "react";
import { fetchApi } from "./api";

interface ProgramFee {
  program_id: number;
  reservation_type: string;
  period: string;
  price: number;
}

let cachedProgramFees: ProgramFee[] | null = null;
let fetchPromise: Promise<ProgramFee[]> | null = null;

function loadProgramFees(): Promise<ProgramFee[]> {
  if (cachedProgramFees) return Promise.resolve(cachedProgramFees);
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetchApi("/api/program-fees")
    .then((r) => r.json())
    .then((data) => { cachedProgramFees = data; return data; })
    .catch(() => []);
  return fetchPromise;
}

export function useProgramFees() {
  const [programFees, setProgramFees] = useState<ProgramFee[]>(cachedProgramFees || []);
  const [loading, setLoading] = useState(!cachedProgramFees);

  useEffect(() => {
    loadProgramFees().then((data) => { setProgramFees(data); setLoading(false); });
  }, []);

  return { programFees, loading };
}
