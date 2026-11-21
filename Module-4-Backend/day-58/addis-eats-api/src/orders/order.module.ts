import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller.js";
import { OrdersService } from "./order.service.js";
import { InMemoryOrderRepository } from "./order.repository.js";

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: "ORDER_REPOSITORY",
      useClass: InMemoryOrderRepository,
    },
  ],
  exports: [OrdersService],
})
export class OrdersModule {}