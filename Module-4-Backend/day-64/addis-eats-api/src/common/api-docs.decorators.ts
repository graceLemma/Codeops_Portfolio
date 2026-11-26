import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiCommonFailureResponses(): MethodDecorator {
  return applyDecorators(
    ApiResponse({ status: 401, description: 'API key is missing.' }),
    ApiResponse({
      status: 403,
      description:
        'API key is invalid, the caller lacks the required role, or the order is not owned by the caller.',
    }),
    ApiResponse({
      status: 408,
      description: 'The request exceeded the five-second timeout.',
    }),
    ApiResponse({
      status: 429,
      description: 'The rate limit was exceeded; includes Retry-After and requestId.',
    }),
    ApiResponse({
      status: 500,
      description: 'The API_KEY setting is missing or the server failed.',
    }),
  );
}
