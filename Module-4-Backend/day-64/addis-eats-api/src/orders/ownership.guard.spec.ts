import { ForbiddenException, type ExecutionContext } from '@nestjs/common';
import type { OrderRepository } from './order.repository.js';
import type { Order } from './order.types.js';
import { OwnershipGuard } from './ownership.guard.js';

describe('OwnershipGuard', () => {
  it('refuses an order owned by a different hard-coded user', () => {
    const otherOrder: Order = {
      id: 9,
      ownerId: 'user-2',
      name: 'Another customer',
      area: 'Bole',
      status: 'Pending',
      dishes: [],
      total: 500,
    };
    const repository: OrderRepository = {
      byId: () => undefined,
      all: () => [],
      findAll: () => [],
      findById: () => otherOrder,
      save: (order) => ({ id: 9, ...order }),
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ params: { id: '9' } }),
      }),
    } as ExecutionContext;
    const guard = new OwnershipGuard(repository);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
