import { Controller, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiCommonFailureResponses } from './api-docs.decorators.js';
import { MetricsService } from './metrics.service.js';

@Controller()
@ApiTags('metrics')
@ApiSecurity('api-key')
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get request counts by endpoint' })
  @ApiResponse({ status: 200, description: 'Current request counts.' })
  @ApiCommonFailureResponses()
  getMetrics(): Record<string, number> {
    return this.metrics.snapshot();
  }
}
