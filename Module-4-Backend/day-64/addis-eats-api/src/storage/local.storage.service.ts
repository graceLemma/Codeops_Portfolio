import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { mkdir, unlink, writeFile } from 'node:fs/promises';

import { dirname, resolve, sep } from 'node:path';

import type { StorageService } from './storage.interface.js';

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly root = resolve(process.cwd(), 'uploads');

  private getSafePath(key: string): string {
    const target = resolve(this.root, key);

    if (
      target !== this.root &&
      !target.startsWith(this.root + sep)
    ) {
      throw new BadRequestException('Invalid storage path');
    }

    return target;
  }

  async put(
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<void> {
    const filePath = this.getSafePath(key);

    await mkdir(dirname(filePath), { recursive: true });

    await writeFile(filePath, body, { flag: 'wx' });
  }

  async delete(key: string): Promise<void> {
    const filePath = this.getSafePath(key);

    try {
      await unlink(filePath);
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        return;
      }

      throw error;
    }
  }

  urlFor(key: string): string {
    return `/uploads/${key}`;
  }
}