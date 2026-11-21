import { Controller, Get, Post, Param, Query, Body, HttpCode, UseGuards } from "@nestjs/common";
import { OrdersService } from "./order.service.js";
import { CreateOrderDto } from "./dto/create-order.dto.js";
import { OwnershipGuard } from "./ownership.guard.js";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query("area") area?: string) {
    return this.ordersService.findAll(area);
  }

  @Get("delayed")
  delayedResponse() {
    return this.ordersService.delayedResponse();
  }

  @Get(":id")
  @UseGuards(OwnershipGuard)
  findOne(@Param("id") id: string) {
    return this.ordersService.find(Number(id));
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}