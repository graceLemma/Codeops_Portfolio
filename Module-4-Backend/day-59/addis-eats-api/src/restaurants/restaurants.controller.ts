import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service.js';
import type { Restaurant, Area } from './restaurant.entity.js';
import { CreateRestaurantDto } from './create.restaurant.dto.js';
import { ParseAreaPipe } from '../common/parse-area.pipe.js';
import { Roles } from '../common/roles.decorator.js';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  findAll(@Query('area', ParseAreaPipe) area?: Area): Restaurant[] {
    return this.restaurantsService.findAll(area);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Restaurant {
    return this.restaurantsService.findOne(id);
  }

  @Post()
  @Roles('admin')
  create(@Body() createRestaurantDto: CreateRestaurantDto): Restaurant {
    return this.restaurantsService.create(createRestaurantDto);
  }
}