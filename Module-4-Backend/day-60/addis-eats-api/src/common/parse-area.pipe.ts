import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common';
import type { Area } from '../orders/order.types.js';

const AREAS: readonly Area[] = ['Bole', 'Kazanchis', 'Piassa', 'CMC'];

@Injectable()
export class ParseAreaPipe implements PipeTransform<unknown, Area | undefined> {
  transform(value: unknown): Area | undefined {
    if (value === undefined || value === '') {
      return undefined;
    }
    if (typeof value !== 'string') {
      throw new BadRequestException('area must be a supported area name');
    }

    const area = AREAS.find(
      (candidate) => candidate.toLowerCase() === value.toLowerCase(),
    );
    if (!area) {
      throw new BadRequestException(`Unsupported area: ${value}`);
    }
    return area;
  }
}
