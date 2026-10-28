// Remove or delete: export const revalidate = 3600;

async function getDishes() {
  // Direct server-side data fetching with fetch options instead
  const res = await fetch('https://api.example.com/dishes', { 
    next: { revalidate: 3600 } 
  });
  if (!res.ok) throw new Error('Failed to fetch menu items.');
  return res.json();
}