import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service.js';
import { Restaurant, Area } from './restaurant.entity.js';
import { CreateRestaurantDto } from './create.restaurant.dto.js';

@Controller('api/restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  findAll(@Query('area') area?: Area): Restaurant[] {
    return this.restaurantsService.findAll(area);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Restaurant {
    return this.restaurantsService.findOne(id);
  }

  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto): Restaurant {
    return this.restaurantsService.create(createRestaurantDto);
  }
}

// Inject OrdersService into RestaurantsController's constructor:
// constructor(
//   private readonly restaurantsService: RestaurantsService,
//   private readonly dishesService: DishesService,
//   private readonly ordersService: OrdersService,
// ) {}

@Get(':id/orders')
findOrders (
  @Param('id', ParseIntPipe) id: number,
  @Query() query: FindOrdersQuery,
): Page<Order> {
  // Validate parent restaurant first (throws 404 if absent)
  this.restaurantsService.findOne(id);
  return this.ordersService.findByRestaurant(id, query);
}