import { Injectable, Inject } from "@nestjs/common";
import type { Order, Area } from "./order.types.js";
import type { OrderRepository } from "./order.repository.js";
import { OrderNotFoundError } from "./order.error.js";
import type { CreateOrderDto } from "./dto/create-order.dto.js";

@Injectable()
export class OrdersService {
  constructor(
    @Inject("ORDER_REPOSITORY") private readonly repository: OrderRepository,
  ) {}

  findAll(area?: string): Order[] {
    return this.repository.findAll(area);
  }

  find(id: number): Order {
    const order = this.repository.findById(id);
    if (!order) {
      throw new OrderNotFoundError(id);
    }
    return order;
  }

  create(dto: CreateOrderDto): Order {
    return this.repository.save({
      name: dto.customer,
      ownerId: "user-1",
      area: dto.area,
      status: "Pending",
      dishes: [],
      phone: dto.phone,
      total: dto.totalSantim,
    });
  }

  async delayedResponse(): Promise<{ delayed: true }> {
    await new Promise((resolve) => setTimeout(resolve, 5100));
    return { delayed: true };
  }
}

export class OrderService {
  constructor(
    private readonly repository: OrderRepository
  ) {}

  find(id: number): Order {
    const order = this.repository.byId(id);

    if (!order) {
      throw new OrderNotFoundError(id);
    }

    return order;
  }

  feesByArea(): Record<Area, number> {
    return {
      Bole: 40,
      Kazanchis: 60,
      Piassa: 60,
      CMC: 60,
    };
  }

  summarise<K extends keyof Order>(
    key: K
  ): Order[K][] {
    return this.repository.all().map(
      (order) => order[key]
    );
  }
}