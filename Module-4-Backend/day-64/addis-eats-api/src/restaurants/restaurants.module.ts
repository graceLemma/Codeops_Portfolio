import { Module } from '@nestjs/common';

import { RestaurantsController } from './restaurants.controller.js';

import { RestaurantsService } from './restaurants.service.js';

import { ParseAreaPipe } from '../common/parse-area.pipe.js';

import { UploadsModule } from '../uploads/uploads.module.js';

@Module({
  imports: [UploadsModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, ParseAreaPipe],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}