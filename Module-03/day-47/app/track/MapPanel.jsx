// app/track/MapPanel.jsx
"use client";

import dynamic from "next/dynamic";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => <div className="h-80 bg-slate-100 animate-pulse rounded-lg" />,
});

export default function MapPanel({ courierPosition }) {
  return <DeliveryMap courierPosition={courierPosition} />;
}