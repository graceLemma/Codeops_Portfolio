// 1. Delivery areas as a readonly array and derived union type
const AREAS = ["Bole", "Kazanchis", "Piassa", "Megenagna"] as const;
export type Area = (typeof AREAS)[number];

// 2. Order status union type
export type OrderStatus = 
  | "PENDING" 
  | "PREPARING" 
  | "ON_THE_WAY" 
  | "DELIVERED" 
  | "CANCELLED";

// 3. Entity shapes
export type Dish = {
  name: string;
  priceSantim: number;
};

export type Order = {
  readonly id: number;
  customerName: string;
  area: Area;
  status: OrderStatus;
  dishes: Dish[];
  phone?: string;
  totalSantim: number;
};

// 4. Delivery fee calculation function
export function deliveryFee(order: Order): number {
  if (order.totalSantim >= 50000) {
    return 0; // Free delivery over 500 ETB (50000 santim)
  } else if (order.area === "Bole") {
    return 4000; // 40 ETB
  }
  return 6000; // 60 ETB elsewhere
}

// 5. Exhaustive status message mapper using 'never'
export function statusMessage(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "Waiting for the restaurant to accept";
    case "PREPARING":
      return "Your food is being cooked";
    case "ON_THE_WAY":
      return "The rider has left the restaurant";
    case "DELIVERED":
      return "Delivered — enjoy your meal";
    case "CANCELLED":
      return "This order was cancelled";
    default:
      // Exhaustiveness check: if a new status is added to OrderStatus 
      // without updating this switch, this assignment fails to compile.
      const unreachable: never = status;
      return unreachable;
  }
}

// 6. Intl helper for currency formatting
function formatEtb(santim: number): string {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
  }).format(santim / 100);
}

// 7. Multi-line template literal receipt generator
export function receipt(order: Order): string {
  const dishLines = order.dishes
    .map((d) => `  - ${d.name}: ${formatEtb(d.priceSantim)}`)
    .join("\n");

  return `
Addis Eats — Order #${order.id}
Customer: ${order.customerName}
Area: ${order.area}
Status: ${statusMessage(order.status)}
Dishes:
${dishLines}
Delivery Fee: ${formatEtb(deliveryFee(order))}
Total: ${formatEtb(order.totalSantim + deliveryFee(order))}
`.trim();
}