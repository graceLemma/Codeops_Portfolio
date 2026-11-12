import { Injectable, NotFoundException } from '@nestjs/common';
import { Restaurant, Area } from './restaurant.entity.js';
import { CreateRestaurantDto } from './create.restaurant.dto.js';

@Injectable()
export class RestaurantsService {
  private restaurants: Restaurant[] = [
    { id: 1, name: 'Yod Abyssinia', area: 'Bole', isOpen: true },
    { id: 2, name: 'Kategna', area: 'Kazanchis', isOpen: true },
  ];

  findAll(area?: Area): Restaurant[] {
    if (area) {
      return this.restaurants.filter((r) => r.area === area);
    }
    return this.restaurants;
  }

  findOne(id: number): Restaurant {
    const restaurant = this.restaurants.find((r) => r.id === id);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return restaurant;
  }

  create(dto: CreateRestaurantDto): Restaurant {
    const id = Math.max(0, ...this.restaurants.map((r) => r.id)) + 1;
    const newRestaurant: Restaurant = {
      id,
      ...dto,
      isOpen: dto.isOpen ?? true,
    };
    this.restaurants.push(newRestaurant);
    return newRestaurant;
  }
}