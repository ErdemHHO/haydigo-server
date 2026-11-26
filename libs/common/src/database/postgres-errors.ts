import { QueryFailedError } from 'typeorm';
import { POSTGRES_ERROR_CODES } from '../constants/database.constants';

export function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string }).code ===
      POSTGRES_ERROR_CODES.uniqueViolation
  );
}
