import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller.js";
import { OrdersService } from "./order.service.js";
import { InMemoryOrderRepository } from "./order.repository.js";
import { OwnershipGuard } from "./ownership.guard.js";

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OwnershipGuard,
    {
      provide: "ORDER_REPOSITORY",
      useClass: InMemoryOrderRepository,
    },
  ],
  exports: [OrdersService],
})
export class OrdersModule {}