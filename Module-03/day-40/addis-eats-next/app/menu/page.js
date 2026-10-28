// Revalidate every hour (Incremental Static Regeneration)
export const revalidate = 3600;

async function getDishes() {
  // Direct server-side data fetching (no unnecessary internal /api/dishes call)
  const res = await fetch('https://api.example.com/dishes', { 
    next: { revalidate: 3600 } 
  });
  if (!res.ok) throw new Error('Failed to fetch menu items.');
  return res.json();
}

export default async function MenuPage() {
  const dishes = await getDishes();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Our Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <div key={dish.id} className="border p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg">{dish.name}</h3>
            <p className="text-gray-600">{dish.description}</p>
            <p className="mt-2 font-semibold">{dish.price} ETB</p>
            <a 
              href={`/menu/${dish.id}`} 
              className="inline-block mt-4 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              View Dish
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}