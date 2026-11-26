import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';

import { Restaurant, Area } from './restaurant.entity.js';

import type { CreateRestaurantDto } from './create.restaurant.dto.js';

import { ImageUploadService } from '../uploads/image-upload.service.js';

import type { UploadedImage } from '../uploads/image-upload.service.js';

@Injectable()
export class RestaurantsService {
  private restaurants: Restaurant[] = [
    { id: 1, name: 'Yod Abyssinia', area: 'Bole', isOpen: true },
    { id: 2, name: 'Kategna', area: 'Kazanchis', isOpen: true },
  ];

  constructor(
    private readonly imageUploadService: ImageUploadService,
  ) {}

  findAll(area?: Area): Restaurant[] {
    if (area) {
      return this.restaurants.filter((r) => r.area === area);
    }

    return this.restaurants;
  }

  findOne(id: number): Restaurant {
    const restaurant = this.restaurants.find((r) => r.id === id);

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID ${id} not found`,
      );
    }

    return restaurant;
  }

  create(dto: CreateRestaurantDto): Restaurant {
    const id = Math.max(0, ...this.restaurants.map((r) => r.id)) + 1;

    const newRestaurant: Restaurant = {
      id,
      name: dto.name,
      area: dto.area,
      isOpen: dto.isOpen ?? true,
    };

    this.restaurants.push(newRestaurant);

    return newRestaurant;
  }

  async uploadImage(
    id: number,
    file: Express.Multer.File,
  ): Promise<Restaurant> {

    const restaurant = this.findOne(id);

    const newImage = await this.imageUploadService.upload(
      'restaurants',
      id,
      file,
    );

    const oldImage: UploadedImage | undefined =
      restaurant.imageKey && restaurant.thumbnailKey
        ? {
            imageKey: restaurant.imageKey,
            thumbnailKey: restaurant.thumbnailKey,
          }
        : undefined;

    try {
      restaurant.imageKey = newImage.imageKey;
      restaurant.thumbnailKey = newImage.thumbnailKey;
    } catch (error) {
      await this.imageUploadService.deleteImage(newImage);
      throw error;
    }

    if (oldImage) {
      await this.imageUploadService.deleteImage(oldImage);
    }

    return restaurant;
  }
}