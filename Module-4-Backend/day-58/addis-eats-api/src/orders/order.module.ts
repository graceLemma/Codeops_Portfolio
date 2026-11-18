import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { InMemoryOrderRepository } from "./repositories/in-memory-order.repository"; // Or your provided repo path

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