import { Controller, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service.js';
import { ApiCommonFailureResponses } from './common/api-docs.decorators.js';

@Controller()
@ApiTags('health')
@ApiSecurity('api-key')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get the API health greeting' })
  @ApiResponse({ status: 200, description: 'API is responding.' })
  @ApiCommonFailureResponses()
  getHello(): string {
    return this.appService.getHello();
  }
}
