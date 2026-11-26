import { Throttle } from '@nestjs/throttler';

export function StrictAuthThrottle(): MethodDecorator {
  return Throttle({ default: { limit: 5, ttl: 60_000 } });
}
