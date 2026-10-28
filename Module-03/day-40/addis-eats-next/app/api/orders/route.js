import { NextResponse } from 'next/server';

export async function GET(request) {
  // Example endpoint logic for order status tracking/polling
  const orders = [
    { id: 1, status: 'Preparing', total: 450 },
  ];

  return NextResponse.json({ success: true, data: orders });
}

export async function POST(request) {
  const body = await request.json();
  
  // Validate order payload here if triggered externally
  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ success: false, error: 'No items in order' }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: 'Order received via API' }, { status: 201 });
}