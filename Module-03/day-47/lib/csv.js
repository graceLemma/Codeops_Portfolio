// lib/csv.js

// Safely escape values containing commas, quotes, or newlines
export const escapeCsvCell = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function exportOrderHistoryCsv(orders, filename = "order-history.csv") {
  const headers = ["Order ID", "Item", "Total (ETB)", "Placed At", "Status"];
  const rows = orders.map((o) => [
    o.id,
    o.itemDescription, // e.g., 'Doro Wat, "Special Kitfo"'
    o.totalAmount,
    o.placedAt,
    o.status,
  ]);

  const csvContent = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url); // Release browser memory
}