import { useState, useEffect } from "react";

/**
 * Custom hook to manage asynchronous data fetching with automatic cancellation.
 */
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function loadData() {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Failed to load data (${res.status} ${res.statusText})`);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}