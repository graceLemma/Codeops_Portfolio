import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private readonly requestCounts = new Map<string, number>();

  record(method: string, path: string): void {
    const endpoint = `${method} ${path}`;
    this.requestCounts.set(endpoint, (this.requestCounts.get(endpoint) ?? 0) + 1);
  }

  snapshot(): Record<string, number> {
    return Object.fromEntries(this.requestCounts);
  }
}
