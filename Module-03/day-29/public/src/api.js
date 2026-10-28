/**
 * Simulated backend API endpoint fetcher
 * Accepts category filter and AbortController signal
 */
export async function fetchDishes(category = "All", signal) {
  const res = await fetch("/dishes.json", { signal });

  // fetch does not reject on HTTP error status (404/500); handle it manually
  if (!res.ok) {
    throw new Error(`Failed to load menu (${res.status} ${res.statusText})`);
  }

  const data = await res.json();

  if (category === "All") {
    return data;
  }

  return data.filter((dish) => dish.category === category);
}/**
 * Simulated backend API endpoint fetcher
 * Accepts category filter and AbortController signal
 */
export async function fetchDishes(category = "All", signal) {
  const res = await fetch("/dishes.json", { signal });

  // fetch does not reject on HTTP error status (404/500); handle it manually
  if (!res.ok) {
    throw new Error(`Failed to load menu (${res.status} ${res.statusText})`);
  }

  const data = await res.json();

  if (category === "All") {
    return data;
  }

  return data.filter((dish) => dish.category === category);
}