import { Order, Area } from "./order.types.js";
import { OrderRepository } from "./order.repository.js";
import { OrderNotFoundError } from "./order.error.js";

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


import { Injectable, Inject } from "@nestjs/common";
import { OrderRepository } from "./interfaces/order-repository.interface";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "../types/order.types";

@Injectable()
export class OrdersService {
  constructor(
    @Inject("ORDER_REPOSITORY") private readonly repo: OrderRepository
  ) {}

  findAll(area?: string): Order[] {
    return this.repo.findAll(area);
  }

  find(id: number): Order {
    const order = this.repo.findById(id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    return order;
  }

  create(dto: CreateOrderDto): Order {
    return this.repo.save({
      ...dto,
      status: "PENDING",
    });
  }
}