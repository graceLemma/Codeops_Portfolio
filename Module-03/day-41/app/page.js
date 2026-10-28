import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Mesob House</h1>
      <p>Ethiopian food, delivered.</p>
    </main>
  );
}

export async function GET() {
const dishes = await db.dish.findMany();
return Response.json(dishes);
}


export async function POST(request) {
const body = await request.json();
const area = request.headers.get("x-area");
return Response.json({ ok: true }, { status: 201 });
}


// app/menu/page.js
import DishList from "@/components/DishList";
import CategoryBar from "@/components/CategoryBar";

export const revalidate = 3600; // ISR every hour

async function getDishes() {
  // Direct data query or fetch from backend source
  const res = await fetch("https://api.example.com/dishes", { 
    next: { revalidate: 3600 } 
  });
  if (!res.ok) throw new Error("Failed to fetch dishes");
  return res.json();
}

export default async function MenuPage() {
  const dishes = await getDishes();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Addis Eats Menu</h1>
      <CategoryBar />
      <DishList dishes={dishes} />
    </main>
  );
}




// app/menu/[id]/page.js
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

export async function generateStaticParams() {
  const res = await fetch("https://api.example.com/dishes");
  const dishes = await res.json();
  
  return dishes.map((dish) => ({
    id: dish.id.toString(),
  }));
}

async function getDish(id) {
  const res = await fetch(`https://api.example.com/dishes/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function DishDetailPage({ params }) {
  const { id } = params;
  const dish = await getDish(id);

  if (!dish) {
    notFound();
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">{dish.name}</h1>
      <p className="text-gray-600 my-2">{dish.description}</p>
      <p className="text-lg font-semibold mb-4">{dish.price} ETB</p>
      <AddToCartButton dish={dish} />
    </div>
  );
}