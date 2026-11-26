import { Module } from '@nestjs/common';

import { StorageModule } from '../storage/storage.module.js';

import { ImageUploadService } from './image-upload.service.js';

@Module({
  imports: [StorageModule],
  providers: [ImageUploadService],
  exports: [ImageUploadService],
})
export class UploadsModule {}