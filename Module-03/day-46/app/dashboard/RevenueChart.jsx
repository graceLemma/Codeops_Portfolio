"use client";

import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";

const etb = (v) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0
  }).format(v);

export default function RevenueChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="area" />
        <YAxis tickFormatter={etb} width={80} />
        <Tooltip formatter={(v) => [etb(v), "Revenue"]} />
        <Bar dataKey="revenue" fill="#1B4D8E" />
      </BarChart>
    </ResponsiveContainer>
  );
}