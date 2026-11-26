import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { memoryStorage } from 'multer';

import { Roles } from '../common/roles.decorator.js';

import { DishesService } from './dishes.service.js';

import { MAX_FILE_SIZE } from '../uploads/image-upload.service.js';

import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('dishes')
@ApiTags('dishes')
export class DishesController {
  constructor(
    private readonly dishesService: DishesService,
  ) {}

  @Post(':id/image')
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    }),
  )
  @ApiOperation({ summary: 'Upload a dish image (admin only)' })
  uploadImage(
    @Param('id', ParseIntPipe) id: number,

    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: MAX_FILE_SIZE,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.dishesService.uploadImage(id, file);
  }
}