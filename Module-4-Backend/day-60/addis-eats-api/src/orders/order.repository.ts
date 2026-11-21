import { Order } from "./order.types.js";

export interface OrderRepository {
  byId(id: number): Order | undefined;
  all(): Order[];
  findAll(area?: string): Order[];
  findById(id: number): Order | undefined;
  save(order: Omit<Order, "id">): Order;
}

export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders: Map<number, Order>;

  constructor(initialOrders: Order[] = []) {
    this.orders = new Map(
      initialOrders.map((order) => [order.id, order])
    );
  }

  byId(id: number): Order | undefined {
    return this.orders.get(id);
  }

  all(): Order[] {
    return Array.from(this.orders.values());
  }

  findAll(area?: string): Order[] {
    const orders = this.all();
    return area ? orders.filter((order) => order.area === area) : orders;
  }

  findById(id: number): Order | undefined {
    return this.byId(id);
  }

  save(order: Omit<Order, "id">): Order {
    const id = Math.max(0, ...this.orders.keys()) + 1;
    const saved = { id, ...order } as Order;
    this.orders.set(id, saved);
    return saved;
  }
}