import { Suspense } from "react";
import Link from "next/link";
import DishList from "./DishList";
import FilterShell from "./FilterShell";
import MenuSkeleton from "./MenuSkeleton";

export default async function MenuPage({ searchParams }) {
  const { category } = await searchParams;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Our menu</h1>

      <FilterShell>
        <Suspense key={category ?? "all"} fallback={<MenuSkeleton />}>
          <DishList category={category} />
        </Suspense>
      </FilterShell>

      <div className="flex flex-col gap-2 mt-6">
        <Link href="/" className="underline">Home</Link>
        <Link href="/cart" className="underline">Cart</Link>
      </div>
    </main>
  );
}


import Link from "next/link";

// Revalidate cache every 1 hour (ISR)
export const revalidate = 3600;

async function getDishes() {
  const res = await fetch("https://api.example.com/dishes", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch menu");
  return res.json();
}

export default async function MenuPage() {
  const dishes = await getDishes();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Our Menu</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {dishes.map((dish) => (
          <div key={dish.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{dish.name}</h2>
            <p className="text-gray-600">{dish.price} ETB</p>
            <Link
              href={`/menu/${dish.id}`}
              className="mt-4 inline-block rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
            >
              View Dish
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}