import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { Dish } from './dish.entity.js';

import { ImageUploadService } from '../uploads/image-upload.service.js';

import type { UploadedImage } from '../uploads/image-upload.service.js';

@Injectable()
export class DishesService {
  private dishes: Dish[] = [
    { id: 1, name: 'Doro Wat' },
    { id: 2, name: 'Tibs' },
  ];

  constructor(
    private readonly imageUploadService: ImageUploadService,
  ) {}

  findOne(id: number): Dish {
    const dish = this.dishes.find((d) => d.id === id);

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    return dish;
  }

  async uploadImage(
    id: number,
    file: Express.Multer.File,
  ): Promise<Dish> {
    const dish = this.findOne(id);

    const newImage = await this.imageUploadService.upload(
      'dishes',
      id,
      file,
    );

    const oldImage: UploadedImage | undefined =
      dish.imageKey && dish.thumbnailKey
        ? {
            imageKey: dish.imageKey,
            thumbnailKey: dish.thumbnailKey,
          }
        : undefined;

    try {
      dish.imageKey = newImage.imageKey;
      dish.thumbnailKey = newImage.thumbnailKey;
    } catch (error) {
      await this.imageUploadService.deleteImage(newImage);
      throw error;
    }

    if (oldImage) {
      await this.imageUploadService.deleteImage(oldImage);
    }

    return dish;
  }
}