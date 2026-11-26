import {
  Injectable,
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { fileTypeFromBuffer } from 'file-type';

import sharp from 'sharp';

import { Inject } from '@nestjs/common';

import { STORAGE_SERVICE } from '../storage/storage.constants.js';

import type { StorageService } from '../storage/storage.interface.js';

import type { Express } from 'express';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const MAX_FILE_SIZE = 2 * 1024 * 1024;

export interface UploadedImage {
  imageKey: string;
  thumbnailKey: string;
}

@Injectable()
export class ImageUploadService {
  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storage: StorageService,
  ) {}

  async upload(
    folder: string,
    ownerId: number,
    file: Express.Multer.File,
  ): Promise<UploadedImage> {
    if (file.size > MAX_FILE_SIZE || file.buffer.length > MAX_FILE_SIZE) {
      throw new BadRequestException('Image must not exceed 2 MB');
    }

    const detectedType = await fileTypeFromBuffer(file.buffer);

    if (
      !detectedType ||
      !ALLOWED_TYPES.includes(detectedType.mime)
    ) {
      throw new UnsupportedMediaTypeException(
        'Only JPEG, PNG and WebP images are allowed',
      );
    }

    const id = randomUUID();

    const imageKey = `${folder}/${ownerId}/${id}-main.webp`;

    const thumbnailKey = `${folder}/${ownerId}/${id}-thumbnail.webp`;

    const mainImage = await sharp(file.buffer)
      .rotate()
      .resize(1200, 800, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer();

    const thumbnail = await sharp(file.buffer)
      .rotate()
      .resize(320, 240, {
        fit: 'cover',
      })
      .webp({ quality: 75 })
      .toBuffer();

    try {
      await this.storage.put(
        imageKey,
        mainImage,
        'image/webp',
      );

      await this.storage.put(
        thumbnailKey,
        thumbnail,
        'image/webp',
      );

      return {
        imageKey,
        thumbnailKey,
      };
    } catch (error) {
      const cleanup = await Promise.allSettled([
        this.storage.delete(imageKey),
        this.storage.delete(thumbnailKey),
      ]);
      const cleanupErrors = cleanup
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map((result) => result.reason);

      if (cleanupErrors.length > 0) {
        throw new AggregateError(
          [error, ...cleanupErrors],
          'Image storage failed and partial files could not be fully cleaned up',
        );
      }

      throw error;
    }
  }

  async deleteImage(image: UploadedImage): Promise<void> {
    const results = await Promise.allSettled([
      this.storage.delete(image.imageKey),
      this.storage.delete(image.thumbnailKey),
    ]);
    const errors = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map((result) => result.reason);

    if (errors.length > 0) {
      throw new AggregateError(errors, 'Failed to delete all image files');
    }
  }
}