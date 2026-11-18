import { IsIn } from 'class-validator';
import { ORDER_STATUSES, OrderStatus } from './find-orders.query.js';

export class UpdateStatusDto {
  @IsIn(ORDER_STATUSES)
  status: orderStatus;
}