import { Controller, Get, Post, Param, Query, Body, HttpCode } from "@nestjs/common";
import { OrdersService } from "./order.service.js";
import { CreateOrderDto } from "./dto/create-order.dto.js";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query("area") area?: string) {
    return this.ordersService.findAll(area);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.find(Number(id));
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}


import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { Page } from '../common/page';
import { FindOrdersQuery } from './dto/find-orders.query';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Order } from './orders.seed';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query() query: FindOrdersQuery): Page<Order> {
    return this.ordersService.findAll(query);
  }

  // Static route MUST be declared above :id
  @Get('pending')
  findPending(@Query() query: FindOrdersQuery): Page<Order> {
    return this.ordersService.findPending(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Order {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ): Order {
    return this.ordersService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.ordersService.remove(id);
  }
}