import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service.js';

@Controller()
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get('metrics')
  getMetrics(): Record<string, number> {
    return this.metrics.snapshot();
  }
}
