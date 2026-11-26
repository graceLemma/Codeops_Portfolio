import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'DELIVERED',
  'CANCELLED',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const AREAS = ['Bole', 'Kazanchis', 'Piassa', 'CMC'] as const;
export type Area = (typeof AREAS)[number];

export const ORDER_SORT_FIELDS = ['createdAt', 'totalSantim', 'status'] as const;
export type OrderSortField = (typeof ORDER_SORT_FIELDS)[number];

export class FindOrdersQuery {
  @IsOptional()
  @IsIn(ORDER_STATUSES)
  status?: OrderStatus;

  @IsOptional()
  @IsIn(AREAS)
  area?: Area;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;

  @IsOptional()
  @IsIn(ORDER_SORT_FIELDS)
  sort: OrderSortField = 'createdAt';
}