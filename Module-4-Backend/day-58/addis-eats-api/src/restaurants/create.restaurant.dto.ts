import { IsString, Length, IsIn, IsBoolean, IsOptional } from 'class-validator';
import { AREAS } from './restaurant.entity.js';
import type { Area } from './restaurant.entity.js';

export class CreateRestaurantDto {
  @IsString()
  @Length(2, 80)
  name!: string;

  @IsIn(AREAS)
  area!: Area;

  @IsBoolean()
  @IsOptional()
  isOpen?: boolean;
}