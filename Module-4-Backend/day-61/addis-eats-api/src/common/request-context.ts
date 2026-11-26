import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';

type RequestContextStore = {
  requestId: string;
};

@Injectable()
export class RequestContext {
  private readonly storage = new AsyncLocalStorage<RequestContextStore>();

  run(requestId: string, callback: () => void): void {
    this.storage.run({ requestId }, callback);
  }

  get requestId(): string | undefined {
    return this.storage.getStore()?.requestId;
  }
}
