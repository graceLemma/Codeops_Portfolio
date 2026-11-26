import { Controller, Get, Post, Param, Query, Body, HttpCode, UseGuards } from "@nestjs/common";
import { OrdersService } from "./order.service.js";
import { CreateOrderDto } from "./dto/create-order.dto.js";
import { OwnershipGuard } from "./ownership.guard.js";
import { ApiCommonFailureResponses } from "../common/api-docs.decorators.js";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";

@Controller("orders")
@ApiTags("orders")
@ApiSecurity("api-key")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: "List delivery orders" })
  @ApiQuery({ name: "area", required: false, description: "Filter by area" })
  @ApiResponse({ status: 200, description: "Orders matching the filter." })
  @ApiCommonFailureResponses()
  findAll(@Query("area") area?: string) {
    return this.ordersService.findAll(area);
  }

  @Get("delayed")
  @ApiOperation({ summary: "Demonstrate the five-second timeout" })
  @ApiResponse({ status: 200, description: "The delayed response completed." })
  @ApiCommonFailureResponses()
  delayedResponse() {
    return this.ordersService.delayedResponse();
  }

  @Get(":id")
  @UseGuards(OwnershipGuard)
  @ApiOperation({ summary: "Get an order owned by the caller" })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({ status: 200, description: "The requested order." })
  @ApiResponse({ status: 404, description: "Order does not exist." })
  @ApiCommonFailureResponses()
  findOne(@Param("id") id: string) {
    return this.ordersService.find(Number(id));
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: "Create a delivery order" })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: "The order was created." })
  @ApiResponse({ status: 400, description: "Order input failed validation." })
  @ApiCommonFailureResponses()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}