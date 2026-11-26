import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller.js';
import { RestaurantsService } from './restaurants.service.js';
import { ParseAreaPipe } from '../common/parse-area.pipe.js';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService, ParseAreaPipe],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
