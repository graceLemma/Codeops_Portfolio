// app/track/page.jsx
"use client";

import { useEffect, useState } from "react";
import MapPanel from "./MapPanel";
import { etb, when } from "@/lib/format";
import { exportOrderHistoryCsv } from "@/lib/csv";

export default function TrackingPage({ initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [connectionState, setConnectionState] = useState("Connecting...");

  // Consume Server-Sent Events (SSE) with cleanup on unmount
  useEffect(() => {
    const es = new EventSource(`/api/orders/${order.id}/stream`);

    es.onopen = () => setConnectionState("Live");
    
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setOrder(data);
      if (data.state === "DELIVERED") {
        setConnectionState("Delivered");
        es.close();
      }
    };

    es.onerror = () => {
      setConnectionState("Reconnecting...");
      es.close();
    };

    return () => {
      es.close(); // Clean up connection on component unmount
    };
  }, [order.id]);

  const sampleHistory = [
    {
      id: order.id,
      itemDescription: order.itemDescription || 'Doro Wat, "Special Kitfo"',
      totalAmount: etb.format(order.totalAmount || 14200),
      placedAt: when.format(new Date(order.placedAt || Date.now())),
      status: order.state,
    },
  ];

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6 font-sans">
      <header className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-xl font-bold">Order Tracking #{order.id}</h1>
          <p className="text-sm text-slate-500">
            Placed: {when.format(new Date(order.placedAt))}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            connectionState === "Live"
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {connectionState}
        </span>
      </header>

      {/* Map Section */}
      <section className="space-y-2">
        <h2 className="font-semibold text-slate-700">Live Map View</h2>
        <MapPanel courierPosition={order.courierCoordinates} />
      </section>

      {/* Accessibility / Text-based Fallback (Crucial for Screen Readers) */}
 <section className="bg-slate-50 p-4 rounded-lg space-y-1 text-sm border">
        <h2 className="font-semibold text-slate-800">Delivery Information (Text)</h2>
        <p><strong>Destination Area:</strong> Bole, Addis Ababa</p>
        <p><strong>Estimated Arrival:</strong> {order.eta || "18:40 EAT"}</p>
        <p><strong>Courier Status:</strong> {order.statusText || "On the way to destination"}</p>
      </main>

      {/* Pricing and Financial Formatting */}
      <section className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div>
          <p className="text-sm text-slate-500">Total Price</p>
          <p className="text-2xl font-bold text-slate-900">
            {etb.format(order.totalAmount || 14200)}
          </p>
        </div>
        <button
          onClick={() => exportOrderHistoryCsv(sampleHistory)}
          className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm hover:bg-slate-800 transition"
        >
          Export CSV History
        </button>
      </section>
    </main>
  );
}