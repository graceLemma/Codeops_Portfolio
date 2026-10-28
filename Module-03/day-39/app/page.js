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