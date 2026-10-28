import { NextResponse } from "next/server";
import { z } from "zod";

const orderSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(9),
  address: z.string().min(5),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = orderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: validation.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    // Save to DB logic here...

    return NextResponse.json({ message: "Order placed successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}