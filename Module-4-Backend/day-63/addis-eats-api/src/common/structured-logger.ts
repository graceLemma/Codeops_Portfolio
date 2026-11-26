import { inspect } from 'node:util';
import { Injectable, type LoggerService } from '@nestjs/common';
import { RequestContext } from './request-context.js';

const LEVELS = ['fatal', 'error', 'warn', 'log', 'debug', 'verbose'] as const;
type LogLevel = (typeof LEVELS)[number];

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  fatal: 0,
  error: 1,
  warn: 2,
  log: 3,
  debug: 4,
  verbose: 5,
};

const REDACTED = '[REDACTED]';
const SENSITIVE_FIELD = /^(authorization|x-api-key|.*phone.*)$/i;

function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redact);
  }
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      SENSITIVE_FIELD.test(key) ? REDACTED : redact(nestedValue),
    ]),
  );
}

function getLogLevel(): LogLevel {
  const configured = (process.env.LOG_LEVEL ?? 'log').toLowerCase();
  const normalized = configured === 'info' ? 'log' : configured;
  if (!LEVELS.includes(normalized as LogLevel)) {
    throw new Error(`Unsupported LOG_LEVEL: ${configured}`);
  }
  return normalized as LogLevel;
}

@Injectable()
export class StructuredLogger implements LoggerService {
  private readonly threshold = LEVEL_PRIORITY[getLogLevel()];
  private readonly pretty = process.env.NODE_ENV === 'development';

  constructor(private readonly requestContext: RequestContext) {}

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.write('log', message, optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.write('error', message, optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.write('warn', message, optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.write('debug', message, optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.write('verbose', message, optionalParams);
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    this.write('fatal', message, optionalParams);
  }

  private write(
    level: LogLevel,
    message: unknown,
    optionalParams: unknown[],
  ): void {
    if (LEVEL_PRIORITY[level] > this.threshold) {
      return;
    }

    const context =
      typeof optionalParams[0] === 'string' ? optionalParams[0] : undefined;
    const payload =
      typeof message === 'object' && message !== null && !Array.isArray(message)
        ? message
        : { message: String(message) };
    const entry = redact({
      timestamp: new Date().toISOString(),
      level: level === 'log' ? 'info' : level,
      ...(context ? { context } : {}),
      ...payload,
      ...(this.requestContext.requestId
        ? { requestId: this.requestContext.requestId }
        : {}),
    });
    const output = this.pretty
      ? inspect(entry, { colors: process.stdout.isTTY, depth: 5, compact: true })
      : JSON.stringify(entry);

    if (level === 'error' || level === 'fatal') {
      console.error(output);
    } else if (level === 'warn') {
      console.warn(output);
    } else {
      console.log(output);
    }
  }
}
