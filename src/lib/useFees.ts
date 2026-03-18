import { useState, useEffect } from "react";
import { fetchApi } from "./api";

interface Fee {
  id: number;
  period: string;
  individual_price: number;
  group_price: number;
}

let cachedFees: Fee[] | null = null;
let fetchPromise: Promise<Fee[]> | null = null;

function loadFees(): Promise<Fee[]> {
  if (cachedFees) return Promise.resolve(cachedFees);
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetchApi("/api/fees")
    .then((r) => r.json())
    .then((data) => { cachedFees = data; return data; })
    .catch(() => []);
  return fetchPromise;
}

export function useFees() {
  const [fees, setFees] = useState<Fee[]>(cachedFees || []);
  const [loading, setLoading] = useState(!cachedFees);

  useEffect(() => {
    loadFees().then((data) => { setFees(data); setLoading(false); });
  }, []);

  return { fees, loading };
}
