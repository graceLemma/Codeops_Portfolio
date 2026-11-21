import { IsIn } from 'class-validator';
import { ORDER_STATUSES } from './find-orders.query.js';
import type { OrderStatus } from './find-orders.query.js';

export class UpdateStatusDto {
  @IsIn(ORDER_STATUSES)
  status!: OrderStatus;
}