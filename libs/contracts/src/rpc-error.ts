export interface RpcErrorBody {
  statusCode: number;
  message: string;
}

export function isRpcErrorBody(value: unknown): value is RpcErrorBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as RpcErrorBody).statusCode === 'number' &&
    typeof (value as RpcErrorBody).message === 'string'
  );
}
