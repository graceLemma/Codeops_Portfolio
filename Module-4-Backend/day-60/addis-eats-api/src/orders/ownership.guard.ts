import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { OrderRepository } from './order.repository.js';

const DEMO_USER_ID = 'user-1';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private readonly repository: OrderRepository,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const orderId = Number(request.params.id);
    const order = this.repository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} was not found`);
    }
    if (order.ownerId !== DEMO_USER_ID) {
      throw new ForbiddenException('This order does not belong to you');
    }
    return true;
  }
}
