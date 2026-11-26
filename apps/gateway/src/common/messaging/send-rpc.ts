import type { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { RPC_TIMEOUT_MS } from '../constants/rpc.constants';

export function sendRpc<TResult, TPayload>(
  client: ClientProxy,
  pattern: string,
  payload: TPayload,
): Promise<TResult> {
  return firstValueFrom(
    client
      .send<TResult, TPayload>(pattern, payload)
      .pipe(timeout(RPC_TIMEOUT_MS)),
  );
}
