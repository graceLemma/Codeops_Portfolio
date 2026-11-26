import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service.js';
import type { Restaurant, Area } from './restaurant.entity.js';
import { CreateRestaurantDto } from './create.restaurant.dto.js';
import { ParseAreaPipe } from '../common/parse-area.pipe.js';
import { Roles } from '../common/roles.decorator.js';
import { ApiCommonFailureResponses } from '../common/api-docs.decorators.js';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@Controller('restaurants')
@ApiTags('restaurants')
@ApiSecurity('api-key')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({ summary: 'List restaurants in Addis Ababa' })
  @ApiQuery({ name: 'area', required: false, description: 'Filter by area' })
  @ApiResponse({ status: 200, description: 'Restaurants matching the filter.' })
  @ApiResponse({ status: 400, description: 'The area is not supported.' })
  @ApiCommonFailureResponses()
  findAll(@Query('area', ParseAreaPipe) area?: Area): Restaurant[] {
    return this.restaurantsService.findAll(area);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a restaurant by ID' })
  @ApiParam({ name: 'id', description: 'Restaurant ID' })
  @ApiResponse({ status: 200, description: 'The requested restaurant.' })
  @ApiResponse({ status: 400, description: 'The ID must be an integer.' })
  @ApiResponse({ status: 404, description: 'Restaurant does not exist.' })
  @ApiCommonFailureResponses()
  findOne(@Param('id', ParseIntPipe) id: number): Restaurant {
    return this.restaurantsService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a restaurant (admin only)' })
  @ApiBody({ type: CreateRestaurantDto })
  @ApiResponse({ status: 201, description: 'The restaurant was created.' })
  @ApiResponse({ status: 400, description: 'Restaurant input failed validation.' })
  @ApiCommonFailureResponses()
  create(@Body() createRestaurantDto: CreateRestaurantDto): Restaurant {
    return this.restaurantsService.create(createRestaurantDto);
  }
}